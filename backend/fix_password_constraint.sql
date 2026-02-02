-- Fix password constraint to allow NULL for Google OAuth users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Optional: Set password to NULL for existing Google OAuth users
UPDATE users SET password = NULL WHERE auth_provider = 'GOOGLE' AND password IS NOT NULL;
