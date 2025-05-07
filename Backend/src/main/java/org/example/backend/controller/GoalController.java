package org.example.backend.controller;

import org.example.backend.model.*;
import org.example.backend.repository.*;
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

        Long id =Long.valueOf(id1);
        Goal request = goalRepository.findById(id1).orElse(null);

        try {
            // Calculate days remaining
            long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), request.getDeadline());

            // Prepare request for Python API
            String requestBody = String.format(
                    "{\"amount\": %f, \"goal_target\": %f, \"goal_saved\": %f, \"goal_time_left_days\": %d}",
                    request.getSavedAmount(),  // Using savedAmount as 'amount'
                    request.getTargetAmount(), // Using targetAmount as 'goal_target'
                    request.getSavedAmount(),  // Using savedAmount as 'goal_saved'
                    daysLeft                  // Calculated days remaining
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    PYTHON_API_URL,
                    entity,
                    String.class
            );
            System.out.println(response.getBody());
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

}

