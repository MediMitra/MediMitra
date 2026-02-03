package com.medimitra.service;

import com.medimitra.dto.AuthResponse;
import com.medimitra.dto.GoogleAuthRequest;
import com.medimitra.dto.LoginRequest;
import com.medimitra.dto.RegisterRequest;
import com.medimitra.dto.OtpResponse;
import com.medimitra.model.User;
import com.medimitra.model.Store;
import com.medimitra.model.EmailOtp;
import com.medimitra.repository.UserRepository;
import com.medimitra.repository.StoreRepository;
import com.medimitra.repository.EmailOtpRepository;
import com.medimitra.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private EmailOtpRepository emailOtpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private EmailService emailService;

    @Value("${google.client.id:}")
    private String googleClientId;

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
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? User.Role.valueOf(request.getRole().toUpperCase()) : User.Role.USER);
        user.setAuthProvider(User.AuthProvider.LOCAL);

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStoreId(),
                user.getPhone(),
                false // phoneRequired
        );
    }

    /**
     * Google Sign-In/Sign-Up handler
     * If user exists with same email, log them in
     * If user doesn't exist, register them automatically
     */
    public AuthResponse googleAuth(GoogleAuthRequest request) {
        try {
            // Verify the Google ID token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken == null) {
                throw new RuntimeException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String googleId = payload.getSubject();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            // Check if user exists by Google ID or email
            Optional<User> existingUserByGoogleId = userRepository.findByGoogleId(googleId);
            Optional<User> existingUserByEmail = userRepository.findByEmail(email);

            User user;
            boolean phoneRequired = false;

            if (existingUserByGoogleId.isPresent()) {
                // User already registered with Google
                user = existingUserByGoogleId.get();
                // Update profile picture if changed
                if (pictureUrl != null && !pictureUrl.equals(user.getProfilePicture())) {
                    user.setProfilePicture(pictureUrl);
                    user = userRepository.save(user);
                }
                // Check if phone is missing
                phoneRequired = user.getPhone() == null || user.getPhone().isEmpty();
            } else if (existingUserByEmail.isPresent()) {
                // User exists with same email but different auth provider
                // Link Google account to existing user
                user = existingUserByEmail.get();
                user.setGoogleId(googleId);
                user.setProfilePicture(pictureUrl);
                if (user.getAuthProvider() == User.AuthProvider.LOCAL) {
                    // Keep as LOCAL if they registered with email/password first
                }
                user = userRepository.save(user);
                phoneRequired = user.getPhone() == null || user.getPhone().isEmpty();
            } else {
                // New user - register them
                user = new User();
                user.setName(name);
                user.setEmail(email);
                user.setGoogleId(googleId);
                user.setProfilePicture(pictureUrl);
                user.setRole(User.Role.USER);
                user.setAuthProvider(User.AuthProvider.GOOGLE);
                
                // Set phone if provided
                if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                    user.setPhone(request.getPhone());
                } else {
                    phoneRequired = true;
                }
                
                user = userRepository.save(user);
            }

            // If phone was provided in request and user doesn't have one, update it
            if (request.getPhone() != null && !request.getPhone().isEmpty() 
                    && (user.getPhone() == null || user.getPhone().isEmpty())) {
                user.setPhone(request.getPhone());
                user = userRepository.save(user);
                phoneRequired = false;
            }

            String token = tokenProvider.generateToken(user.getId(), user.getEmail());

            return new AuthResponse(
                    token,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getStoreId(),
                    user.getPhone(),
                    phoneRequired
            );
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    /**
     * Update user's phone number and optionally set password for Google OAuth users
     */
    public AuthResponse updatePhone(Long userId, String phone, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPhone(phone);
        
        // If password is provided (for Google OAuth users), hash and save it
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        
        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStoreId(),
                user.getPhone(),
                false
        );
    }

    /**
     * Generate and send OTP for email verification
     */
    @Transactional
    public OtpResponse sendEmailOtp(String email, String name) {
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            return new OtpResponse(false, "Email already registered");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Delete any existing OTPs for this email
        emailOtpRepository.deleteByEmail(email);

        // Save new OTP
        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setOtp(otp);
        emailOtpRepository.save(emailOtp);

        // Send OTP email
        try {
            emailService.sendOtpEmail(email, otp, name);
            return new OtpResponse(true, "OTP sent successfully to your email");
        } catch (Exception e) {
            return new OtpResponse(false, "Failed to send OTP: " + e.getMessage());
        }
    }

    /**
     * Verify OTP
     */
    @Transactional
    public OtpResponse verifyEmailOtp(String email, String otp) {
        // Find the latest OTP for this email
        Optional<EmailOtp> emailOtpOpt = emailOtpRepository
                .findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(email);

        if (emailOtpOpt.isEmpty()) {
            return new OtpResponse(false, "No OTP found for this email");
        }

        EmailOtp emailOtp = emailOtpOpt.get();

        // Check if OTP is expired
        if (emailOtp.isExpired()) {
            return new OtpResponse(false, "OTP has expired. Please request a new one");
        }

        // Check if OTP matches
        if (!emailOtp.getOtp().equals(otp)) {
            return new OtpResponse(false, "Invalid OTP");
        }

        // Mark OTP as verified
        emailOtp.setVerified(true);
        emailOtpRepository.save(emailOtp);

        return new OtpResponse(true, "Email verified successfully");
    }

    /**
     * Register user after email verification
     */
    @Transactional
    public AuthResponse registerWithVerifiedEmail(RegisterRequest request) {
        // Check if there's a verified OTP for this email
        Optional<EmailOtp> verifiedOtpOpt = emailOtpRepository
                .findTopByEmailAndVerifiedTrueOrderByCreatedAtDesc(request.getEmail());

        if (verifiedOtpOpt.isEmpty()) {
            throw new RuntimeException("Email not verified. Please verify your email first");
        }

        EmailOtp verifiedOtp = verifiedOtpOpt.get();
        
        // Check if the verified OTP is still valid (within 10 minutes of creation)
        if (verifiedOtp.isExpired()) {
            throw new RuntimeException("Email verification has expired. Please register again");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? User.Role.valueOf(request.getRole().toUpperCase()) : User.Role.USER);
        user.setAuthProvider(User.AuthProvider.LOCAL);
        user.setEmailVerified(true);

        user = userRepository.save(user);

        // Delete OTP records for this email
        emailOtpRepository.deleteByEmail(request.getEmail());

        // Send welcome email
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        } catch (Exception e) {
            // Don't fail registration if welcome email fails
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStoreId(),
                user.getPhone(),
                false // phoneRequired
        );
    }
}
