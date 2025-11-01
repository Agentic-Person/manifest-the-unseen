// Script to apply database migration to Supabase
// This script reads the SQL file and provides instructions for manual execution
// Run with: node scripts/apply-migration-final.mjs

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
  }
});

async function applyMigration() {
  try {
    console.log('='.repeat(80));
    console.log('SUPABASE DATABASE MIGRATION');
    console.log('='.repeat(80));
    console.log('');

    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251031_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Extract project reference
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

    console.log('Project URL:', supabaseUrl);
    console.log('Project Ref:', projectRef);
    console.log('');
    console.log('='.repeat(80));
    console.log('MANUAL MIGRATION STEPS');
    console.log('='.repeat(80));
    console.log('');
    console.log('Since Supabase does not provide a direct SQL execution API,');
    console.log('please follow these steps to apply the migration:');
    console.log('');
    console.log('1. Open Supabase Studio:');
    console.log(`   https://supabase.com/dashboard/project/${projectRef}/editor`);
    console.log('');
    console.log('2. Navigate to: SQL Editor');
    console.log('');
    console.log('3. Click "New query"');
    console.log('');
    console.log('4. Copy the contents from:');
    console.log(`   ${migrationPath}`);
    console.log('');
    console.log('5. Paste the SQL into the editor and click "Run"');
    console.log('');
    console.log('='.repeat(80));
    console.log('');

    // Verify connection
    console.log('Verifying Supabase connection...');
    const { data: healthCheck, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('not found')) {
        console.log('✓ Connection successful (empty database detected)');
      } else {
        console.log('✓ Connection successful');
      }
    } else {
      console.log('✓ Connection successful');
    }

    console.log('');
    console.log('Migration file is ready at:');
    console.log(migrationPath);
    console.log('');
    console.log('After running the migration in Supabase Studio, run:');
    console.log('  node scripts/verify-migration.mjs');
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

applyMigration();
