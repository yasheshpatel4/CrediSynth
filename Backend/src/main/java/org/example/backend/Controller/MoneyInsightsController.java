package org.example.backend.controller;

import org.example.backend.model.UserProfile;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.InsightsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
@CrossOrigin(origins = "http://localhost:5173")
public class MoneyInsightsController {

    @Autowired
    private InsightsService insightsService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> getInsights(@PathVariable String userId) {
        return ResponseEntity.ok(insightsService.generateInsights(userId));
    }
}




