package com.medimitra.repository;

import com.medimitra.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findByEmailAndOtpAndVerifiedFalse(String email, String otp);
    Optional<EmailOtp> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);
    Optional<EmailOtp> findTopByEmailAndVerifiedTrueOrderByCreatedAtDesc(String email);
    
    // Find all OTPs for an email (for manual deletion)
    List<EmailOtp> findByEmail(String email);
    
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("DELETE FROM EmailOtp e WHERE e.email = :email")
    void deleteByEmail(@Param("email") String email);
}
