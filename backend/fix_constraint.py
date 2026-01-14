import psycopg2

# Database connection parameters
conn_params = {
    'host': 'aws-1-ap-south-1.pooler.supabase.com',
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres.thcfrsehlyxrpwvmwcdy',
    'password': 'Dheeraj@#123'
}

try:
    # Connect to database
    print("Connecting to database...")
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
