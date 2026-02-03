package com.medimitra.service;

import com.medimitra.model.Order;
import com.medimitra.model.OrderItem;
import com.medimitra.model.Address;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

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
     * Send order invoice email to customer after successful order placement
     */
    public void sendOrderInvoiceEmail(Order order) {
        try {
            String toEmail = order.getUser().getEmail();
            String userName = order.getUser().getName();
            
            logger.info("Attempting to send invoice email to: {} for Order #{}", toEmail, order.getId());
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("MediMitra - Order Confirmation #" + order.getId());
            
            // Build order items list
            StringBuilder itemsList = new StringBuilder();
            int itemNo = 1;
            for (OrderItem item : order.getItems()) {
                BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                itemsList.append(String.format("  %d. %s\n", itemNo, item.getMedicine().getName()));
                itemsList.append(String.format("     Qty: %d × ₹%.2f = ₹%.2f\n\n", 
                    item.getQuantity(), item.getPrice(), itemTotal));
                itemNo++;
            }
            
            // Build delivery address
            Address address = order.getAddress();
            String deliveryAddress = String.format("%s\n     %s%s\n     %s, %s - %s",
                address.getFullName(),
                address.getAddressLine1(),
                address.getAddressLine2() != null ? ", " + address.getAddressLine2() : "",
                address.getCity(),
                address.getState(),
                address.getZipCode()
            );
            
            // Format date
            String orderDate = order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "Thank you for your order! Your order has been placed successfully.\n\n" +
                "═══════════════════════════════════════════════════════\n" +
                "                    ORDER INVOICE\n" +
                "═══════════════════════════════════════════════════════\n\n" +
                "Order ID: #%d\n" +
                "Order Date: %s\n" +
                "Payment Method: %s\n" +
                "Status: %s\n\n" +
                "───────────────────────────────────────────────────────\n" +
                "ITEMS ORDERED:\n" +
                "───────────────────────────────────────────────────────\n" +
                "%s" +
                "───────────────────────────────────────────────────────\n" +
                "                              TOTAL: ₹%.2f\n" +
                "───────────────────────────────────────────────────────\n\n" +
                "DELIVERY ADDRESS:\n" +
                "     %s\n\n" +
                "%s" +
                "═══════════════════════════════════════════════════════\n\n" +
                "You can track your order status in your MediMitra account.\n\n" +
                "If you have any questions, please contact our support.\n\n" +
                "Thank you for shopping with MediMitra!\n\n" +
                "Best regards,\n" +
                "MediMitra Team\n" +
                "Your Trusted Medical E-Commerce Platform",
                userName,
                order.getId(),
                orderDate,
                order.getPaymentMethod() != null ? order.getPaymentMethod() : "N/A",
                order.getStatus().name(),
                itemsList.toString(),
                order.getTotalAmount(),
                deliveryAddress,
                order.getStore() != null ? "ASSIGNED STORE: " + order.getStore().getName() + "\n\n" : ""
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            logger.info("Invoice email sent successfully to: {} for Order #{}", toEmail, order.getId());
        } catch (Exception e) {
            // Don't throw exception for invoice email failure - order is already placed
            logger.error("Failed to send invoice email for Order #{}: {}", order.getId(), e.getMessage());
        }
    }
}
