/**
 * Apply Supabase Database Migration via REST API
 *
 * This script applies the initial database schema to Supabase using the SQL Editor API.
 *
 * Usage: node scripts/apply-migration-rest.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('ERROR: Could not parse Supabase project reference from URL');
  process.exit(1);
}

console.log('Supabase Migration Tool (REST API)');
console.log('===================================\n');
console.log('Project:', projectRef);
console.log('URL:', supabaseUrl);
console.log('\n');

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });

    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: responseData });
        } else {
          resolve({ success: false, error: responseData, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function applyMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251031_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Migration file size:', sql.length, 'characters');
    console.log('Starting migration...\n');

    // Try to execute the entire SQL at once first
    console.log('Attempting to execute full migration...\n');

    const result = await executeSQL(sql);

    if (result.success) {
      console.log('✓ Migration executed successfully!\n');
    } else {
      console.log('Note: Direct execution returned status', result.statusCode);
      console.log('This is expected - Supabase REST API doesn\'t support multi-statement SQL execution');
      console.log('You can run the migration manually in the Supabase SQL Editor instead.\n');

      console.log('Instructions:');
      console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
      console.log('2. Copy the contents of: supabase/migrations/20251031_initial_schema.sql');
      console.log('3. Paste into the SQL Editor');
      console.log('4. Click "Run"');
      console.log('\nAlternatively, you can run each table creation statement separately.');
    }

    // Verify what tables exist
    await verifyTables();

  } catch (error) {
    console.error('\nMigration error:', error.message);
    console.log('\nManual migration required. Follow the instructions above.');
  }
}

async function verifyTables() {
  console.log('\nVerifying tables...\n');

  const tables = [
    'user_profiles',
    'workbook_progress',
    'journal_entries',
    'ai_conversations',
    'subscription_status'
  ];

  for (const table of tables) {
    try {
      const result = await new Promise((resolve, reject) => {
        const options = {
          hostname: `${projectRef}.supabase.co`,
          port: 443,
          path: `/rest/v1/${table}?select=count&limit=0`,
          method: 'HEAD',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          }
        };

        const req = https.request(options, (res) => {
          resolve({ statusCode: res.statusCode });
        });

        req.on('error', reject);
        req.end();
      });

      if (result.statusCode === 200) {
        console.log(`  ✓ ${table}: EXISTS`);
      } else {
        console.log(`  ✗ ${table}: NOT FOUND (status: ${result.statusCode})`);
      }
    } catch (error) {
      console.log(`  ✗ ${table}: ERROR - ${error.message}`);
    }
  }

  console.log('\n');
}

// Run the migration
applyMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
