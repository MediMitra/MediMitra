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
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/check-admin")
    public ResponseEntity<Map<String, Object>> checkAdmin() {
        Map<String, Object> response = new HashMap<>();
        
        User admin = userRepository.findByEmail("admin@medimitra.com").orElse(null);
        
        if (admin == null) {
            response.put("exists", false);
            response.put("message", "Admin user not found in database");
            return ResponseEntity.ok(response);
        }
        
        response.put("exists", true);
        response.put("id", admin.getId());
        response.put("name", admin.getName());
        response.put("email", admin.getEmail());
        response.put("role", admin.getRole().name());
        response.put("hasPassword", admin.getPassword() != null);
        response.put("passwordLength", admin.getPassword() != null ? admin.getPassword().length() : 0);
        
        // Test if password "123456" matches
        boolean matches = passwordEncoder.matches("123456", admin.getPassword());
        response.put("password123456Matches", matches);
        
        // Generate a fresh BCrypt hash for "123456" to compare
        String freshHash = passwordEncoder.encode("123456");
        response.put("freshHashSample", freshHash.substring(0, 20) + "...");
        response.put("storedHashSample", admin.getPassword() != null ? admin.getPassword().substring(0, 20) + "..." : "null");
        
        return ResponseEntity.ok(response);
    }
}
