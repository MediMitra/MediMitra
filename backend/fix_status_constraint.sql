-- Fix orders status check constraint to include RECEIVED status

-- Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new constraint with all 4 status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('PENDING', 'RECEIVED', 'DELIVERED', 'CANCELLED'));
