/**
 * Run Supabase Migration via Direct PostgreSQL Connection
 *
 * This script connects directly to the Supabase PostgreSQL database
 * and executes the migration SQL file.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('ERROR: Could not parse Supabase project reference');
  process.exit(1);
}

// Supabase connection string format for Supavisor (connection pooler)
// https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
const connectionString = `postgresql://postgres.${projectRef}:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

// Try different connection configurations
const connectionConfigs = [
  // Transaction mode pooler (port 6543)
  {
    host: `aws-0-us-west-1.pooler.supabase.com`,
    port: 6543,
    database: 'postgres',
    user: `postgres.${projectRef}`,
    password: supabaseServiceKey,
    ssl: { rejectUnauthorized: false }
  },
  // Session mode pooler (port 5432)
  {
    host: `aws-0-us-west-1.pooler.supabase.com`,
    port: 5432,
    database: 'postgres',
    user: `postgres.${projectRef}`,
    password: supabaseServiceKey,
    ssl: { rejectUnauthorized: false }
  },
  // Direct connection
  {
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: supabaseServiceKey,
    ssl: { rejectUnauthorized: false }
  }
];

async function tryConnection(config, index) {
  console.log(`\nAttempt ${index + 1}: Trying ${config.host}:${config.port}...`);

  const client = new Client(config);

  try {
    await client.connect();
    console.log('✓ Connection successful!');
    return client;
  } catch (error) {
    console.log(`✗ Connection failed: ${error.message}`);
    return null;
  }
}

async function runMigration() {
  console.log('\n' + '='.repeat(70));
  console.log('  SUPABASE DIRECT DATABASE MIGRATION');
  console.log('='.repeat(70) + '\n');
  console.log('Project:', projectRef);
  console.log('URL:', supabaseUrl);

  let client = null;

  // Try each connection configuration
  for (let i = 0; i < connectionConfigs.length; i++) {
    client = await tryConnection(connectionConfigs[i], i);
    if (client) break;
  }

  if (!client) {
    console.log('\n' + '='.repeat(70));
    console.log('  DIRECT CONNECTION NOT AVAILABLE');
    console.log('='.repeat(70) + '\n');
    console.log('Unable to establish direct PostgreSQL connection.');
    console.log('This is expected for some Supabase configurations.\n');
    console.log('Please use the Supabase Dashboard instead:\n');
    console.log('1. Open: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    console.log('2. Copy: supabase/migrations/20251031_initial_schema.sql');
    console.log('3. Paste and click "Run"\n');
    console.log('Or run: node scripts/setup-database.js for detailed instructions\n');
    console.log('='.repeat(70) + '\n');
    process.exit(1);
  }

  try {
    // Read the migration file
    console.log('\nReading migration file...');
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251031_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('File size:', sql.length, 'characters');
    console.log('\n' + '='.repeat(70));
    console.log('  EXECUTING MIGRATION');
    console.log('='.repeat(70) + '\n');

    // Split into statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Total statements: ${statements.length}\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Execute in a transaction
    await client.query('BEGIN');

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim().length === 0) continue;

      // Extract statement type for logging
      const statementType = statement.match(/^(CREATE|ALTER|DROP)/i)?.[1] || 'SQL';
      const objectMatch = statement.match(/(TABLE|INDEX|POLICY|FUNCTION|TRIGGER)\s+(\S+)/i);
      const objectName = objectMatch ? objectMatch[2].replace(/[()]/g, '') : '';
      const displayName = objectName ? `${statementType} ${objectMatch[1]} ${objectName}` : statementType;

      process.stdout.write(`[${i + 1}/${statements.length}] ${displayName.substring(0, 50).padEnd(50)}... `);

      try {
        await client.query(statement);
        console.log('✓');
        successCount++;
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log('SKIP');
          skipCount++;
        } else {
          console.log('ERROR');
          console.log(`    ${error.message.split('\n')[0].substring(0, 80)}`);
          errorCount++;
          // Don't throw - continue with other statements
        }
      }
    }

    if (errorCount === 0) {
      await client.query('COMMIT');
      console.log('\n✓ Transaction committed');
    } else {
      await client.query('ROLLBACK');
      console.log('\n⚠ Transaction rolled back due to errors');
    }

    console.log('\n' + '='.repeat(70));
    console.log('  MIGRATION RESULTS');
    console.log('='.repeat(70) + '\n');
    console.log(`  Success: ${successCount}`);
    console.log(`  Skipped: ${skipCount} (already exists)`);
    console.log(`  Errors:  ${errorCount}`);
    console.log('\n' + '='.repeat(70) + '\n');

    if (errorCount === 0 && successCount > 0) {
      console.log('✓ Migration completed successfully!\n');
      console.log('Next steps:');
      console.log('  1. Run: node scripts/verify-database.js');
      console.log('  2. Check tables: https://supabase.com/dashboard/project/' + projectRef + '/editor\n');
    } else if (skipCount > 0 && errorCount === 0) {
      console.log('✓ Migration already applied (all tables exist)\n');
      console.log('Next steps:');
      console.log('  1. Run: node scripts/verify-database.js\n');
    } else {
      console.log('⚠ Migration completed with errors\n');
      console.log('Some objects may already exist or there may be SQL errors.');
      console.log('Check the Supabase dashboard for details.\n');
    }

  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      // Ignore rollback errors
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
