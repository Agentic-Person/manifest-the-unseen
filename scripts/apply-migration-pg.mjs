// Script to apply database migration to Supabase using pg (PostgreSQL client)
// Run with: node scripts/apply-migration-pg.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Extract project reference from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

// Construct connection string for direct database access
// Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
const connectionString = `postgresql://postgres.${projectRef}:${supabaseServiceKey}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

async function applyMigration() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase database...');
    console.log('Project:', projectRef);

    await client.connect();
    console.log('✓ Connected successfully!\n');

    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251031_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration...\n');

    // Execute the entire SQL file
    await client.query(sql);

    console.log('✓ Migration completed successfully!\n');

    // Verify tables were created
    console.log('Verifying tables...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('\nTables created:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check RLS is enabled
    console.log('\nChecking Row-Level Security...');
    const rlsResult = await client.query(`
      SELECT schemaname, tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log('\nRLS Status:');
    rlsResult.rows.forEach(row => {
      console.log(`  - ${row.tablename}: ${row.rowsecurity ? '✓ ENABLED' : '✗ DISABLED'}`);
    });

  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✓ Database connection closed');
  }
}

applyMigration();
