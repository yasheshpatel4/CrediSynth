package org.example.backend.Controller;

import org.example.backend.Modal.User;
import org.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// Removed @CrossOrigin to rely on global CorsConfig
public class UserController {

    @Autowired
    private UserService userService;

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
                return ResponseEntity.ok().body("{\"message\":\"Login successful\"}");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\":\"Invalid username or password\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\":\"An error occurred during login\"}");
        }
    }
}
