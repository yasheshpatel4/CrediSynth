package org.example.backend.Controller;


import org.example.backend.Service.FlaskService;
import org.example.backend.model.Investment;
import org.example.backend.model.User;
import org.example.backend.Repository.InvestmentRepository;
import org.example.backend.Repository.UserRepository;
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

    public InvestmentController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Autowired
    private InvestmentRepository investmentRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private FlaskService flaskService;

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

    @PostMapping("/predict/{id}")
    public Map<String, Object> analyzeInvestment(@PathVariable Long id) {
        Investment investment = investmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Investment not found with ID: " + id));
        return flaskService.analyzeInvestment(investment);
    }

}
//    import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//    @RestController
//    @RequestMapping("/investment")
//    public class InvestmentController {
//
//        @Autowired
//        private FlaskService flaskService;
//
//        @PostMapping("/analyze")
//        public String analyzeInvestment(@RequestBody Investment data) {
//            return flaskService.callFlaskPrediction(data);
//        }
//    }
//
//
//}
