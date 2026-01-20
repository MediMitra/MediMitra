import os
import psycopg2

# Database connection parameters (use env vars; defaults for host/user only)
conn_params = {
    'host': os.getenv('DB_HOST', 'aws-1-ap-south-1.pooler.supabase.com'),
    'port': int(os.getenv('DB_PORT', '5432')),
    'database': os.getenv('DB_NAME', 'postgres'),
    'user': os.getenv('DB_USERNAME', 'postgres.thcfrsehlyxrpwvmwcdy'),
    'password': os.getenv('DB_PASSWORD')
}

try:
    # Connect to database
    print("Connecting to database...")
    if not conn_params['password']:
        raise RuntimeError("DB_PASSWORD environment variable is required for fix_constraint.py")
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    
    # Drop old constraint
    print("Dropping old constraint...")
    cursor.execute("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;")
    
    # Add new constraint with RECEIVED status
    print("Adding new constraint with RECEIVED status...")
    cursor.execute("""
        ALTER TABLE orders 
        ADD CONSTRAINT orders_status_check 
        CHECK (status IN ('PENDING', 'RECEIVED', 'DELIVERED', 'CANCELLED'));
    """)
    
    # Commit changes
    conn.commit()
    print("✅ Successfully updated orders_status_check constraint!")
    
    # Close connection
    cursor.close()
    conn.close()
    print("✅ Database connection closed.")
    
except Exception as e:
    print(f"❌ Error: {e}")
