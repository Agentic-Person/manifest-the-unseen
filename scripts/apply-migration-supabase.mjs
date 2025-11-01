// Script to apply database migration to Supabase using Supabase client
// Run with: node scripts/apply-migration-supabase.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function executeSqlBatch(sqlStatements) {
  const results = [];

  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i];
    console.log(`\n[${i + 1}/${sqlStatements.length}] Executing statement...`);
    console.log(`Preview: ${sql.substring(0, 80)}...`);

    try {
      // Use the REST API to execute SQL via RPC
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`✗ Failed:`, error);
        results.push({ success: false, error, statement: sql.substring(0, 100) });
      } else {
        console.log(`✓ Success`);
        results.push({ success: true, statement: sql.substring(0, 100) });
      }
    } catch (error) {
      console.error(`✗ Error:`, error.message);
      results.push({ success: false, error: error.message, statement: sql.substring(0, 100) });
    }
  }

  return results;
}

async function applyMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251031_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Parsing SQL statements...');

    // Split by semicolon but be smart about it
    const statements = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10); // Filter out empty or very short statements

    console.log(`Found ${statements.length} SQL statements\n`);
    console.log('Applying migration to Supabase...');
    console.log('URL:', supabaseUrl);

    // Since Supabase doesn't have a built-in RPC for executing arbitrary SQL,
    // we'll need to manually execute each statement type
    // For now, let's just try to execute the full SQL file

    console.log('\nNote: Supabase client library does not support executing raw DDL SQL directly.');
    console.log('You need to use the Supabase Studio SQL Editor or Supabase CLI instead.\n');

    console.log('INSTRUCTIONS:');
    console.log('1. Open Supabase Studio: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy the contents of: supabase/migrations/20251031_initial_schema.sql');
    console.log('4. Paste and run in the SQL Editor\n');

    console.log('Alternatively, run this command with Supabase CLI:');
    console.log('npx supabase db push --db-url <your-direct-database-url>\n');

    // Try to at least verify connection
    console.log('Verifying Supabase connection...');
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('✓ Connection successful (table not found is expected for new database)');
    } else if (error) {
      console.log('Connection status:', error.message);
    } else {
      console.log('✓ Connection successful');
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

applyMigration();
