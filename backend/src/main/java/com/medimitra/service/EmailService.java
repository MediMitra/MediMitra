package com.medimitra.service;

import com.medimitra.model.Order;
import com.medimitra.model.OrderItem;
import com.medimitra.model.Address;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private InvoicePdfGenerator invoicePdfGenerator;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp, String userName) {
        try {
            logger.info("Attempting to send OTP email to: {}", toEmail);
            
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
            
            logger.info("OTP email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            logger.info("Attempting to send welcome email to: {}", toEmail);
            
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
            
            logger.info("Welcome email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            // Don't throw exception for welcome email failure
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    /**
     * Send order invoice email to customer with PDF attachment
     */
    public void sendOrderInvoiceEmail(Order order) {
        try {
            String toEmail = order.getUser().getEmail();
            String userName = order.getUser().getName();
            
            logger.info("Attempting to send invoice email with PDF to: {} for Order #{}", toEmail, order.getId());
            
            // Generate PDF invoice
            byte[] pdfBytes = invoicePdfGenerator.generateInvoicePdf(order);
            
            // Create MIME message for attachment support
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("MediMitra - Order Invoice #" + order.getId());
            
            // Email body
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Thank you for your order!\n\n" +
                "Please find your invoice attached as a PDF document.\n\n" +
                "Order Details:\n" +
                "• Invoice Number: INV-%06d\n" +
                "• Order ID: #%d\n" +
                "• Total Amount: ₹%s\n" +
                "• Status: %s\n\n" +
                "Your order will be delivered to:\n" +
                "%s\n\n" +
                "Thank you for choosing MediMitra for your healthcare needs!\n\n" +
                "For any queries, contact us at bisht.dheeraj2004c@gmail.com or call +91-9389788529\n\n" +
                "Best regards,\n" +
                "Team MediMitra",
                userName,
                order.getId(),
                order.getId(),
                order.getTotalAmount().toString(),
                order.getStatus(),
                formatAddress(order.getAddress(), userName)
            );
            
            helper.setText(emailBody);
            
            // Attach PDF invoice
            String fileName = String.format("MediMitra_Invoice_%d.pdf", order.getId());
            helper.addAttachment(fileName, new ByteArrayResource(pdfBytes));
            
            mailSender.send(mimeMessage);
            
            logger.info("Invoice email with PDF sent successfully to: {} for Order #{}", toEmail, order.getId());
            
        } catch (MessagingException e) {
            logger.error("Failed to create invoice email message for Order #{}: {}", order.getId(), e.getMessage());
            throw new RuntimeException("Failed to create invoice email: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Failed to send invoice email for Order #{}: {}", order.getId(), e.getMessage());
            throw new RuntimeException("Failed to send invoice email: " + e.getMessage());
        }
    }
    
    private String formatAddress(Address address, String userName) {
        if (address == null) {
            return "Address not available";
        }
        
        StringBuilder sb = new StringBuilder();
        sb.append(userName).append("\n");
        if (address.getAddressLine1() != null) {
            sb.append(address.getAddressLine1()).append("\n");
        }
        sb.append(address.getCity()).append(", ").append(address.getState());
        if (address.getZipCode() != null) {
            sb.append(" - ").append(address.getZipCode());
        }
        return sb.toString();
    }
}
