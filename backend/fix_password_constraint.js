const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'aws-1-us-east-1.pooler.supabase.com',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USERNAME || 'postgres.gufhpybptyzcpofgljxc',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function fixPasswordConstraint() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Removing NOT NULL constraint from password column...');
    await client.query('ALTER TABLE users ALTER COLUMN password DROP NOT NULL;');
    
    console.log('Setting password to NULL for existing Google OAuth users...');
    const result = await client.query("UPDATE users SET password = NULL WHERE auth_provider = 'GOOGLE';");
    
    console.log('✅ Successfully updated password constraint!');
    console.log(`✅ Updated ${result.rowCount} Google OAuth user(s).`);
    console.log('✅ Google OAuth users can now sign in without password.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nTo run this script:');
    console.error('1. Ensure .env file has DB_PASSWORD set');
    console.error('2. Run: node fix_password_constraint.js');
  } finally {
    await client.end();
    console.log('✅ Database connection closed.');
  }
}

fixPasswordConstraint();
