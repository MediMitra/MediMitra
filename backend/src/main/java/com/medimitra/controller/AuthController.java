package com.medimitra.controller;

import com.medimitra.dto.AuthResponse;
import com.medimitra.dto.GoogleAuthRequest;
import com.medimitra.dto.LoginRequest;
import com.medimitra.dto.RegisterRequest;
import com.medimitra.dto.SendOtpRequest;
import com.medimitra.dto.VerifyOtpRequest;
import com.medimitra.dto.OtpResponse;
import com.medimitra.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest request) {
        try {
            AuthResponse response = authService.googleAuth(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    @PostMapping("/update-phone")
    public ResponseEntity<AuthResponse> updatePhone(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String phone = (String) request.get("phone");
            String password = request.get("password") != null ? (String) request.get("password") : null;
            AuthResponse response = authService.updatePhone(userId, phone, password);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update phone: " + e.getMessage());
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponse> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            OtpResponse response = authService.sendEmailOtp(request.getEmail(), request.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(new OtpResponse(false, "Failed to send OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<OtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            OtpResponse response = authService.verifyEmailOtp(request.getEmail(), request.getOtp());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(new OtpResponse(false, "Verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register-verified")
    public ResponseEntity<AuthResponse> registerWithVerifiedEmail(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.registerWithVerifiedEmail(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
}
