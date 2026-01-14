-- Fix orders status constraint to include RECEIVED
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('PENDING', 'RECEIVED', 'DELIVERED', 'CANCELLED'));
