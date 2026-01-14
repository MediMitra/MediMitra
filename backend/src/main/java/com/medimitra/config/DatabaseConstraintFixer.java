package com.medimitra.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConstraintFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Drop old constraint
            jdbcTemplate.execute("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check");
            
            // Add new constraint with RECEIVED status
            jdbcTemplate.execute("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('PENDING', 'RECEIVED', 'DELIVERED', 'CANCELLED'))");
            
            System.out.println("✅ Successfully updated orders_status_check constraint!");
        } catch (Exception e) {
            System.out.println("⚠️ Constraint already updated or error: " + e.getMessage());
        }
    }
}
