import os
import psycopg2

# Database connection parameters (use env vars; defaults for host/user only)
conn_params = {
    'host': os.getenv('DB_HOST', 'aws-1-us-east-1.pooler.supabase.com'),
    'port': int(os.getenv('DB_PORT', '5432')),
    'database': os.getenv('DB_NAME', 'postgres'),
    'user': os.getenv('DB_USERNAME', 'postgres'),
    'password': os.getenv('DB_PASSWORD')
}

try:
    # Connect to database
    print("Connecting to database...")
    if not conn_params['password']:
        raise RuntimeError("DB_PASSWORD environment variable is required")
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    
    # Fix password constraint to allow NULL for Google OAuth users
    print("Removing NOT NULL constraint from password column...")
    cursor.execute("ALTER TABLE users ALTER COLUMN password DROP NOT NULL;")
    
    # Set password to NULL for existing Google OAuth users
    print("Setting password to NULL for existing Google OAuth users...")
    cursor.execute("UPDATE users SET password = NULL WHERE auth_provider = 'GOOGLE';")
    
    # Commit changes
    conn.commit()
    print("✅ Successfully updated password constraint!")
    print("✅ Google OAuth users can now sign in without password.")
    
    # Close connection
    cursor.close()
    conn.close()
    print("✅ Database connection closed.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nTo run this script:")
    print("1. Set DB_PASSWORD environment variable:")
    print("   - Windows PowerShell: $env:DB_PASSWORD='your-password'")
    print("   - Linux/Mac: export DB_PASSWORD='your-password'")
    print("2. Run: python fix_password_constraint.py")
