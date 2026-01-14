package com.medimitra.service;

import com.medimitra.dto.AuthResponse;
import com.medimitra.dto.LoginRequest;
import com.medimitra.dto.RegisterRequest;
import com.medimitra.model.User;
import com.medimitra.model.Store;
import com.medimitra.repository.UserRepository;
import com.medimitra.repository.StoreRepository;
import com.medimitra.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        // First try to find user
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        
        if (user != null) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            String token = tokenProvider.generateToken(user.getId(), user.getEmail());

            return new AuthResponse(
                    token,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getStoreId()
            );
        }
        
        // Try to find store
        Store store = storeRepository.findByEmail(request.getEmail()).orElse(null);
        
        if (store != null) {
            if (store.getPassword() == null || !passwordEncoder.matches(request.getPassword(), store.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            String token = tokenProvider.generateToken(store.getId(), store.getEmail());

            return new AuthResponse(
                    token,
                    store.getId(),
                    store.getName(),
                    store.getEmail(),
                    "STORE",
                    store.getId()
            );
        }
        
        throw new RuntimeException("Invalid email or password");
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? User.Role.valueOf(request.getRole().toUpperCase()) : User.Role.USER);

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStoreId()
        );
    }
}
