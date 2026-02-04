package com.medimitra.service;

import com.medimitra.model.Order;
import com.medimitra.model.OrderItem;
import com.medimitra.model.Address;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
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

import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private InvoicePdfGenerator invoicePdfGenerator;

    @Value("${spring.mail.username:}")
    private String mailUsername;
    
    @Value("${spring.mail.password:}")
    private String mailPassword;
    
    @Value("${mail.from:noreply@medimitra.com}")
    private String fromEmail;
    
    // Check if we should use SendGrid API (for production) or SMTP (for localhost)
    private boolean useSendGridApi() {
        return "apikey".equals(mailUsername) && mailPassword != null && mailPassword.startsWith("SG.");
    }

    public void sendOtpEmail(String toEmail, String otp, String userName) {
        try {
            logger.info("Attempting to send OTP email to: {}", toEmail);
            
            String subject = "MediMitra - Email Verification OTP";
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "Thank you for registering with MediMitra!\n\n" +
                "Your One-Time Password (OTP) for email verification is: %s\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "⚠️ NOTE: If you don't see this email in your inbox, please check your SPAM/JUNK folder.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "MediMitra Team",
                userName, otp
            );
            
            if (useSendGridApi()) {
                sendEmailViaSendGrid(toEmail, subject, emailBody);
            } else {
                sendEmailViaSMTP(toEmail, subject, emailBody);
            }
            
            logger.info("OTP email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            logger.info("Attempting to send welcome email to: {}", toEmail);
            
            String subject = "Welcome to MediMitra!";
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
            
            if (useSendGridApi()) {
                sendEmailViaSendGrid(toEmail, subject, emailBody);
            } else {
                sendEmailViaSMTP(toEmail, subject, emailBody);
            }
            
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
            
            String subject = "MediMitra - Order Invoice #" + order.getId();
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
            
            String fileName = String.format("MediMitra_Invoice_%d.pdf", order.getId());
            
            if (useSendGridApi()) {
                sendEmailWithAttachmentViaSendGrid(toEmail, subject, emailBody, pdfBytes, fileName);
            } else {
                sendEmailWithAttachmentViaSMTP(toEmail, subject, emailBody, pdfBytes, fileName);
            }
            
            logger.info("Invoice email with PDF sent successfully to: {} for Order #{}", toEmail, order.getId());
            
        } catch (Exception e) {
            logger.error("Failed to send invoice email for Order #{}: {}", order.getId(), e.getMessage());
            throw new RuntimeException("Failed to send invoice email: " + e.getMessage());
        }
    }
    
    // SendGrid API implementation (for production - works on Render)
    private void sendEmailViaSendGrid(String toEmail, String subject, String body) throws IOException {
        Email from = new Email(fromEmail);
        Email to = new Email(toEmail);
        Content content = new Content("text/plain", body);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(mailPassword); // API key
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 400) {
                throw new IOException("SendGrid API error: " + response.getStatusCode() + " - " + response.getBody());
            }
            
            logger.info("Email sent via SendGrid API to: {}", toEmail);
        } catch (IOException ex) {
            logger.error("SendGrid API error: {}", ex.getMessage());
            throw ex;
        }
    }
    
    private void sendEmailWithAttachmentViaSendGrid(String toEmail, String subject, String body, byte[] pdfBytes, String fileName) throws IOException {
        Email from = new Email(fromEmail);
        Email to = new Email(toEmail);
        Content content = new Content("text/plain", body);
        Mail mail = new Mail(from, subject, to, content);
        
        // Add PDF attachment
        Attachments attachments = new Attachments();
        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
        attachments.setContent(base64Pdf);
        attachments.setType("application/pdf");
        attachments.setFilename(fileName);
        attachments.setDisposition("attachment");
        mail.addAttachments(attachments);

        SendGrid sg = new SendGrid(mailPassword); // API key
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 400) {
                throw new IOException("SendGrid API error: " + response.getStatusCode() + " - " + response.getBody());
            }
            
            logger.info("Email with attachment sent via SendGrid API to: {}", toEmail);
        } catch (IOException ex) {
            logger.error("SendGrid API error: {}", ex.getMessage());
            throw ex;
        }
    }
    
    // SMTP implementation (for localhost)
    private void sendEmailViaSMTP(String toEmail, String subject, String body) {
        if (mailSender == null) {
            throw new RuntimeException("Mail sender not configured");
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        
        logger.info("Email sent via SMTP to: {}", toEmail);
    }
    
    private void sendEmailWithAttachmentViaSMTP(String toEmail, String subject, String body, byte[] pdfBytes, String fileName) throws MessagingException {
        if (mailSender == null) {
            throw new RuntimeException("Mail sender not configured");
        }
        
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body);
        helper.addAttachment(fileName, new ByteArrayResource(pdfBytes));
        
        mailSender.send(mimeMessage);
        
        logger.info("Email with attachment sent via SMTP to: {}", toEmail);
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
