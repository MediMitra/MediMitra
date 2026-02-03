package com.medimitra.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediMitra - Email Verification OTP");
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "Thank you for registering with MediMitra!\n\n" +
                "Your One-Time Password (OTP) for email verification is: %s\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "MediMitra Team",
                userName, otp
            );
            
            message.setText(emailBody);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to MediMitra!");
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "Welcome to MediMitra - Your Trusted Medical E-Commerce Platform!\n\n" +
                "Your email has been successfully verified. You can now:\n" +
                "• Browse thousands of authentic medicines\n" +
                "• Order from verified pharmacies\n" +
                "• Get doorstep delivery\n" +
                "• Track your orders in real-time\n\n" +
                "Thank you for choosing MediMitra for your healthcare needs.\n\n" +
                "Best regards,\n" +
                "MediMitra Team",
                userName
            );
            
            message.setText(emailBody);
            mailSender.send(message);
        } catch (Exception e) {
            // Don't throw exception for welcome email failure
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }
}
