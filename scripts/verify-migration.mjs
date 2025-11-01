// Script to verify database migration was applied successfully
// Run with: node scripts/verify-migration.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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

async function verifyMigration() {
  console.log('='.repeat(80));
  console.log('VERIFYING SUPABASE DATABASE MIGRATION');
  console.log('='.repeat(80));
  console.log('');

  const expectedTables = [
    'user_profiles',
    'workbook_progress',
    'journal_entries',
    'ai_conversations',
    'subscription_status'
  ];

  let allTablesExist = true;
  let successCount = 0;

  console.log('Checking tables...\n');

  for (const tableName of expectedTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`✗ ${tableName.padEnd(25)} - NOT FOUND`);
          allTablesExist = false;
        } else if (error.code === '42P01') {
          console.log(`✗ ${tableName.padEnd(25)} - NOT FOUND`);
          allTablesExist = false;
        } else {
          console.log(`✓ ${tableName.padEnd(25)} - EXISTS (${error.message})`);
          successCount++;
        }
      } else {
        console.log(`✓ ${tableName.padEnd(25)} - EXISTS`);
        successCount++;
      }
    } catch (error) {
      console.log(`✗ ${tableName.padEnd(25)} - ERROR: ${error.message}`);
      allTablesExist = false;
    }
  }

  console.log('');
  console.log('='.repeat(80));
  console.log(`RESULT: ${successCount}/${expectedTables.length} tables exist`);
  console.log('='.repeat(80));

  if (allTablesExist && successCount === expectedTables.length) {
    console.log('✓ Migration verified successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Generate TypeScript types: node scripts/generate-types.mjs');
    console.log('  2. Update lib/supabase.ts with the working client');
    console.log('');
    process.exit(0);
  } else {
    console.log('✗ Migration incomplete. Please run the SQL migration in Supabase Studio.');
    console.log('');
    console.log('Instructions:');
    console.log('  1. Run: node scripts/apply-migration-final.mjs');
    console.log('  2. Follow the instructions to apply the migration manually');
    console.log('  3. Re-run this verification script');
    console.log('');
    process.exit(1);
  }
}

verifyMigration();
