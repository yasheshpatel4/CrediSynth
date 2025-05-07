package org.example.backend.controller;

import org.example.backend.model.Investment;
import org.example.backend.model.User;
import org.example.backend.repository.InvestmentRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investments")
@CrossOrigin(origins = "http://localhost:5173")
public class InvestmentController {

    private RestTemplate restTemplate;
    public InvestmentController(RestTemplate restTemplate){
        this.restTemplate = restTemplate;
    }

    @Autowired
    private InvestmentRepository investmentRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/user/{userId}")
    public List<Investment> getInvestments(@PathVariable String userId) {
        Long userIdLong = userRepo.findByEmail(userId).getId();
        return investmentRepo.findByUserId(userIdLong);
    }

    @PostMapping("/add/{userEmail}")
    public Investment addInvestment(@RequestBody Investment investment, @PathVariable String userEmail) {
        User user = userRepo.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + userEmail);
        }
        investment.setUser(user); // Use setUser, not setUserId
        return investmentRepo.save(investment);
    }

    @PutMapping("/{id}")
    public Investment updateInvestment(@PathVariable Long id, @RequestBody Investment updated) {
        Investment inv = investmentRepo.findById(id).orElseThrow();
        inv.setInvestmentType(updated.getInvestmentType());
        inv.setAsset(updated.getAsset());
        inv.setAmount(updated.getAmount());
        inv.setPurchasePrice(updated.getPurchasePrice());
        inv.setPurchaseDate(updated.getPurchaseDate());
        inv.setCurrentValue(updated.getCurrentValue());
        return investmentRepo.save(inv);
    }

    @DeleteMapping("/{id}")
    public void deleteInvestment(@PathVariable Long id) {
        investmentRepo.deleteById(id);
    }

    @PostMapping("/analyze/{id}")
    public ResponseEntity<?> analyzeInvestment(@PathVariable String id) {
        Investment request = investmentRepo.findById(Long.parseLong(id)).orElse(null);
        String flaskUrl = "http://localhost:5000/analyze"; // Flask API URL
        // Send POST request to Flask
        ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, request, Map.class);

        // Return Flask response to frontend
        return ResponseEntity.ok(response.getBody());
    }

}
