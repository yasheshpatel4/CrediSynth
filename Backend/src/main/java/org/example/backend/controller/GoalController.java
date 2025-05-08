package org.example.backend.Controller;

import org.example.backend.model.*;
import org.example.backend.Repository.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:5173")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    private final String PYTHON_API_URL = "http://localhost:5000/predict";
    private final RestTemplate restTemplate;

    // Constructor injection
    public GoalController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/{userEmail}")
    public ResponseEntity<?> createGoal(@PathVariable String userEmail, @RequestBody Goal goal) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail(userEmail));
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        goal.setUser(user);
        Goal saved = goalRepository.save(goal);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Data inserted successfully");
        response.put("goal", saved);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userEmail}")
    public ResponseEntity<List<Goal>> getGoals(@PathVariable String userEmail) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail(userEmail));
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        Long userId = userOpt.get().getId();
        List<Goal> goals = goalRepository.findByUserId(userId);

        return ResponseEntity.ok(goals);
    }

    @PostMapping("/analyze/{id1}")
    public ResponseEntity<?> predictInvestment(@PathVariable Long id1) {
        Goal request = goalRepository.findById(id1).orElse(null);
        if (request == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Goal not found\"}");
        }

        try {
            long daysLeft = calculateDaysRemaining(request);
            // Use internal logic instead of calling the Python API
            double confidence = calculatePredictionConfidence(request, daysLeft);
            String message = generatePredictionMessage(confidence);
            String resultMessage = generateUserFriendlyMessage(confidence, message, daysLeft);

            // Construct result object to send back
            Map<String, Object> result = new HashMap<>();
            result.put("message", resultMessage);
            result.put("confidence", confidence);
            result.put("prediction", (confidence >= 0.7) ? 1 : 0); // Predicted outcome based on confidence
            result.put("status", "success");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Helper method to calculate days remaining
    private long calculateDaysRemaining(Goal request) {
        return ChronoUnit.DAYS.between(LocalDate.now(), request.getDeadline());
    }

    // New internal logic for calculating prediction confidence
    private double calculatePredictionConfidence(Goal request, long daysLeft) {
        // Simple logic for the prediction (you can replace it with more complex calculations)
        double savingsRate = request.getSavedAmount() / request.getTargetAmount();
        double timeFactor = (double) daysLeft / 365; // Assuming 365 days in a year

        // Confidence calculation (this is just an example formula)
        double confidence = (savingsRate * timeFactor) * 0.9;

        // Ensure the confidence is within the range [0, 1]
        return Math.min(Math.max(confidence, 0), 1);
    }

    // New message generation logic based on internal calculation
    private String generatePredictionMessage(double confidence) {
        if (confidence >= 0.7) {
            return "It seems highly likely that you will reach your goal!";
        } else if (confidence >= 0.4) {
            return "There is a moderate chance that you will reach your goal.";
        } else {
            return "It seems unlikely that you will reach your goal without adjustments.";
        }
    }

    // Helper method to generate a user-friendly message for the result
    private String generateUserFriendlyMessage(double confidence, String message, long daysLeft) {
        String predictionStatus = (confidence >= 0.7) ? "Highly Likely" : "Uncertain";
        return String.format("Based on your monthly savings, goal amount, and remaining days, it is %s that you will achieve your goal.\n\n" +
                "Confidence level: %.2f%%\n\n" +
                "Analysis: %s\n" +
                "Time left: %d days", predictionStatus, confidence * 100, message, daysLeft);
    }

}

