package org.example.backend.controller;

import org.example.backend.model.User;
import org.example.backend.model.UserProfile;
import org.example.backend.repository.UserProfileRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @RequestMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            boolean success = userService.registerUser(user);
            if (success) {
                return ResponseEntity.ok().body("{\"message\":\"Signup successful\"}");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\":\"Username or email already exists\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\":\"An error occurred during registration\"}");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            boolean authenticated = userService.authenticateUser(user.getUsername(), user.getPassword());
            if (authenticated) {
                // Fetch full user object to get email
                User authenticatedUser = userService.getUserByUsername(user.getUsername());

                // Prepare response map
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("email", authenticatedUser.getEmail());
                response.put("username", authenticatedUser.getUsername());
                // You can also add a token if you're using JWT

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("message", "Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "An error occurred during login"));
        }
    }

    @PostMapping("/profile/{email}")
    public ResponseEntity<?> createOrUpdateProfile(@PathVariable String email, @RequestBody UserProfile profileData) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail(email));

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        UserProfile profile;

        if (user.getUserProfile() != null) {
            // Update existing profile
            profile = user.getUserProfile();
            profile.setMonthlyIncome(profileData.getMonthlyIncome());
            profile.setSavingsTarget(profileData.getSavingsTarget());
            profile.setInvestmentPreferences(profileData.getInvestmentPreferences());
            profile.setRiskTolerance(profileData.getRiskTolerance());
            profile.setFinancialGoals(profileData.getFinancialGoals());
        } else {
            // Create new profile and bind to user
            profile = new UserProfile();
            profile.setMonthlyIncome(profileData.getMonthlyIncome());
            profile.setSavingsTarget(profileData.getSavingsTarget());
            profile.setInvestmentPreferences(profileData.getInvestmentPreferences());
            profile.setRiskTolerance(profileData.getRiskTolerance());
            profile.setFinancialGoals(profileData.getFinancialGoals());

            profile.setUser(user);
            user.setUserProfile(profile);
        }

        userProfileRepository.save(profile); // CascadeType.ALL on profile will handle profile save
        return ResponseEntity.ok("Profile saved successfully");
    }

    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getProfileByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email);
        if (user == null || user.getUserProfile() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
        }
        return ResponseEntity.ok(user.getUserProfile());
    }

}
