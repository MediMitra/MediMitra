package com.medimitra.controller;

import com.medimitra.model.User;
import com.medimitra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/setup")
public class SetupController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, String>> createAdmin() {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Check if admin already exists
            if (userRepository.findByEmail("admin@medimitra.com").isPresent()) {
                response.put("status", "error");
                response.put("message", "Admin user already exists with email: admin@medimitra.com");
                return ResponseEntity.badRequest().body(response);
            }

            // Create admin user
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@medimitra.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(User.Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            userRepository.save(admin);

            response.put("status", "success");
            response.put("message", "Admin user created successfully!");
            response.put("email", "admin@medimitra.com");
            response.put("password", "123456");
            response.put("note", "Please change the password after first login");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create admin: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
