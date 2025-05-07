package org.example.backend.controller;

import org.example.backend.model.User;
import org.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
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
                // Fetch full user object to get email
                User authenticatedUser = userService.getUserByUsername(user.getUsername());

                // Prepare response map
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("email", authenticatedUser.getEmail());
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
}
