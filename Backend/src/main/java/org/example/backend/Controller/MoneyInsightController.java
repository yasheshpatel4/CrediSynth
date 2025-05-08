package org.example.backend.controller;

import org.example.backend.model.MoneyInsight;
import org.example.backend.model.User;
import org.example.backend.repository.MoneyInsightRepository;
import org.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/money-insights")
@CrossOrigin(origins = "*")  // Allow all origins for development; restrict in production
public class MoneyInsightController {

    @Autowired
    private MoneyInsightRepository moneyInsightRepo;

    @Autowired
    private org.example.backend.Repository.UserRepository userRepo;

    @Autowired
    private RestTemplate restTemplate;

    private final String flaskUrl = "http://localhost:5000/money-insights/analyze";

    @GetMapping("/user/{userEmail}")
    public List<MoneyInsight> getMoneyInsights(@PathVariable String userEmail) {
        Long userIdLong = userRepo.findByEmail(userEmail).getId();
        return moneyInsightRepo.findByUserId(userIdLong);
    }

    @PostMapping("/add/{userEmail}")
    public MoneyInsight addMoneyInsight(@RequestBody Map<String, Object> payload, @PathVariable String userEmail) {
        User user = userRepo.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + userEmail);
        }

        MoneyInsight moneyInsight = new MoneyInsight();
        moneyInsight.setDescription((String) payload.get("description"));
        Object amountObj = payload.get("amount");
        if (amountObj instanceof Number) {
            moneyInsight.setAmount(((Number) amountObj).doubleValue());
        } else {
            moneyInsight.setAmount(Double.parseDouble(amountObj.toString()));
        }
        moneyInsight.setCategory((String) payload.get("category"));
        moneyInsight.setType((String) payload.get("type"));

        try {
            moneyInsight.setDate(java.time.LocalDate.parse((String) payload.get("date")));
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format: " + payload.get("date"));
        }

        moneyInsight.setUser(user);
        return moneyInsightRepo.save(moneyInsight);
    }

    @PostMapping("/analyze/{userEmail}")
    public ResponseEntity<?> analyzeMoneyInsights(@PathVariable String userEmail) {
        try {
            User user = userRepo.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            List<MoneyInsight> insights = moneyInsightRepo.findByUserId(user.getId());

            List<Map<String, Object>> expenses = insights.stream().map(insight -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("description", insight.getDescription());
                map.put("amount", insight.getAmount());
                map.put("date", insight.getDate() != null ? insight.getDate().toString() : null);
                map.put("category", insight.getCategory());
                map.put("type", insight.getType());
                return map;
            }).toList();

            Map<String, Object> requestBody = Map.of(
                "userEmail", userEmail,
                "expenses", expenses
            );

            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, requestBody, Map.class);

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}
