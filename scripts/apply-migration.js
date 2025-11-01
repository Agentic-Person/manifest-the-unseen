/**
 * Apply Supabase Database Migration
 *
 * This script applies the initial database schema to Supabase.
 * It reads the migration SQL file and executes it using the pg library.
 *
 * Usage: node scripts/apply-migration.js
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Extract database connection details from Supabase URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Parse Supabase URL to get project reference
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('ERROR: Could not parse Supabase project reference from URL');
  process.exit(1);
}

// Construct PostgreSQL connection string
// Supabase connection format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
// Note: The password is the service role key
const password = encodeURIComponent(supabaseServiceKey);
const connectionString = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

console.log('Supabase Migration Tool');
console.log('======================\n');
console.log('Project:', projectRef);
console.log('URL:', supabaseUrl);
console.log('\n');

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function applyMigration() {
  const client = await pool.connect();

  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251031_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Migration file size:', sql.length, 'characters');
    console.log('Starting migration...\n');

    // Execute the entire migration as a single transaction
    await client.query('BEGIN');

    try {
      // Split into statements for better error reporting
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`Executing ${statements.length} SQL statements...\n`);

      let successCount = 0;
      let skipCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim().length === 0) continue;

        // Extract statement type for logging
        const statementType = statement.match(/^(CREATE|ALTER|DROP|INSERT|UPDATE)/i)?.[1] || 'SQL';
        const objectName = statement.match(/(TABLE|INDEX|POLICY|FUNCTION|TRIGGER)\s+(\w+)/i);
        const displayName = objectName ? `${objectName[1]} ${objectName[2]}` : statementType;

        process.stdout.write(`  [${i + 1}/${statements.length}] ${displayName}... `);

        try {
          await client.query(statement + ';');
          console.log('✓');
          successCount++;
        } catch (error) {
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log('SKIP (exists)');
            skipCount++;
          } else {
            console.log('ERROR');
            console.log(`    ${error.message.split('\n')[0]}`);
            errorCount++;
          }
        }
      }

      await client.query('COMMIT');

      console.log('\n' + '='.repeat(60));
      console.log('Migration Results:');
      console.log(`  Success: ${successCount}`);
      console.log(`  Skipped: ${skipCount}`);
      console.log(`  Errors:  ${errorCount}`);
      console.log('='.repeat(60) + '\n');

      // Verify tables
      await verifyTables(client);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('\nMigration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

async function verifyTables(client) {
  console.log('Verifying database schema...\n');

  const tables = [
    'user_profiles',
    'workbook_progress',
    'journal_entries',
    'ai_conversations',
    'subscription_status'
  ];

  for (const table of tables) {
    try {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        );
      `, [table]);

      const exists = result.rows[0].exists;
      console.log(`  ${exists ? '✓' : '✗'} ${table}`);
    } catch (error) {
      console.log(`  ✗ ${table} - ERROR: ${error.message}`);
    }
  }

  // Check RLS status
  console.log('\nVerifying Row-Level Security (RLS)...\n');

  for (const table of tables) {
    try {
      const result = await client.query(`
        SELECT relrowsecurity
        FROM pg_class
        WHERE relname = $1;
      `, [table]);

      const rlsEnabled = result.rows[0]?.relrowsecurity || false;
      console.log(`  ${rlsEnabled ? '✓' : '✗'} ${table} RLS ${rlsEnabled ? 'ENABLED' : 'DISABLED'}`);
    } catch (error) {
      console.log(`  ✗ ${table} - ERROR checking RLS`);
    }
  }

  console.log('\n✓ Database schema verification complete!\n');
}

// Run the migration
applyMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
