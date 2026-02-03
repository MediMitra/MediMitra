package com.medimitra.repository;

import com.medimitra.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findByEmailAndOtpAndVerifiedFalse(String email, String otp);
    Optional<EmailOtp> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);
    Optional<EmailOtp> findTopByEmailAndVerifiedTrueOrderByCreatedAtDesc(String email);
    void deleteByEmail(String email);
}
