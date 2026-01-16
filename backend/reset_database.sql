-- COMPLETE DATABASE RESET SCRIPT
-- WARNING: This will permanently delete ALL data from the database
-- Run this script in your PostgreSQL database to start fresh

-- Step 1: Delete all data (respecting foreign key constraints)
-- Delete in the correct order to avoid constraint violations

-- Delete order items first (references orders)
DELETE FROM order_items;

-- Delete orders (references users and stores)
DELETE FROM orders;

-- Delete cart items (references users and medicines)
DELETE FROM cart_items;

-- Delete carts (references users)
DELETE FROM carts;

-- Delete addresses (references users)
DELETE FROM addresses;

-- Delete medicines (references stores)
DELETE FROM medicines;

-- Delete stores
DELETE FROM stores;

-- Delete users
DELETE FROM users;

-- Step 2: Reset auto-increment sequences (optional, keeps IDs clean)
ALTER SEQUENCE IF EXISTS order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS orders_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS cart_items_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS addresses_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS medicines_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS stores_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;

-- Step 3: Create admin user with new encryption
-- Password: 123456 (BCrypt encoded)
-- BCrypt hash for "123456" is: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES (
    'Admin User',
    'admin@medimitra.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verify the results
SELECT 'Database reset completed successfully!' AS status;
SELECT 'Admin user created with email: admin@medimitra.com and password: 123456' AS credentials;
SELECT COUNT(*) as remaining_users FROM users;
SELECT COUNT(*) as remaining_stores FROM stores;
SELECT COUNT(*) as remaining_orders FROM orders;
