package org.example.backend.controller;

import org.example.backend.model.*;
import org.example.backend.repository.*;
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
    private org.example.backend.repository.GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    private final String PYTHON_API_URL = "http://localhost:5001/predict";
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
   public ResponseEntity<?> analyzeGoal(@PathVariable String id1) {
        Goal g = goalRepository.findById(Long.parseLong(id1)).orElse(null);
        ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_API_URL, g, Map.class);
        System.out.println(response.getBody());
        // Return Flask response to frontend
        return ResponseEntity.ok(response.getBody());
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        goalRepository.deleteById(id);
        return ResponseEntity.ok().body("{\"message\": \"Goal deleted successfully\"}");
    }

}

