package com.medimitra.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1) // Run before DataInitializer
public class OrderDataCleaner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("🧹 Cleaning all orders data...");
            
            // Delete all order items first (due to foreign key constraint)
            jdbcTemplate.execute("DELETE FROM order_items");
            System.out.println("✅ Deleted all order items");
            
            // Delete all orders
            jdbcTemplate.execute("DELETE FROM orders");
            System.out.println("✅ Deleted all orders");
            
            System.out.println("🎉 All orders cleared successfully! Fresh start ready.");
        } catch (Exception e) {
            System.out.println("⚠️ Error clearing orders: " + e.getMessage());
        }
    }
}
