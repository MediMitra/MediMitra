package com.medimitra.controller;

import com.medimitra.model.User;
import com.medimitra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-fix")
public class AdminFixController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetAdminPassword() {
        Map<String, String> response = new HashMap<>();
        
        try {
            User admin = userRepository.findByEmail("admin@medimitra.com").orElse(null);
            
            if (admin == null) {
                response.put("status", "error");
                response.put("message", "Admin user not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Generate fresh BCrypt hash for "123456"
            String newPassword = passwordEncoder.encode("123456");
            admin.setPassword(newPassword);
            userRepository.save(admin);

            response.put("status", "success");
            response.put("message", "Admin password reset successfully!");
            response.put("email", "admin@medimitra.com");
            response.put("password", "123456");
            response.put("note", "Password hash has been regenerated and saved");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reset password: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
