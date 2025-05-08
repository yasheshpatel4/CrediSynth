package org.example.backend.service;

import org.example.backend.model.Goal;
import org.example.backend.model.Investment;
import org.example.backend.model.User;
import org.example.backend.model.UserProfile;
import org.example.backend.repository.GoalRepository;
import org.example.backend.repository.InvestmentRepository;
import org.example.backend.repository.UserProfileRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class InsightsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    public Map<String, Object> generateInsights(String email) {

        Long userId = userRepository.findByEmail(email).getId();

// Fetch user data
        UserProfile userProfile = userProfileRepository.findById(userId).orElse(null);
        List<Investment> investments = investmentRepository.findByUserId(userId);
        List<Goal> goals = goalRepository.findByUserId(userId);

// Map user profile
        Map<String, Object> userProfileMap = new HashMap<>();
        if (userProfile != null) {
            userProfileMap.put("monthlyIncome", userProfile.getMonthlyIncome());
            userProfileMap.put("savingsTarget", userProfile.getSavingsTarget());
            userProfileMap.put("investmentPreferences", userProfile.getInvestmentPreferences());
            userProfileMap.put("riskTolerance", userProfile.getRiskTolerance());
            userProfileMap.put("financialGoals", userProfile.getFinancialGoals());
        }

// Map investments
        List<Map<String, Object>> investmentList = new ArrayList<>();
        for (Investment inv : investments) {
            Map<String, Object> invMap = new HashMap<>();
            invMap.put("investmentType", inv.getInvestmentType());
            invMap.put("asset", inv.getAsset());
            invMap.put("amount", inv.getAmount());
            invMap.put("purchasePrice", inv.getPurchasePrice());
            investmentList.add(invMap);
        }

// Map goals
        List<Map<String, Object>> goalList = new ArrayList<>();
        for (Goal goal : goals) {
            Map<String, Object> goalMap = new HashMap<>();
            goalMap.put("name", goal.getName());
            goalMap.put("targetAmount", goal.getTargetAmount());
            goalMap.put("savedAmount", goal.getSavedAmount());
            goalList.add(goalMap);
        }

// Build payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("userProfile", userProfileMap);
        payload.put("investments", investmentList);
        payload.put("goals", goalList);

// Call Python microservice
        RestTemplate restTemplate = new RestTemplate();
        String pythonApiUrl = "http://localhost:5003/analyze/insights";

        Map<String, Object> insights = restTemplate.postForObject(pythonApiUrl, payload, Map.class);
        return insights;

    }
}
