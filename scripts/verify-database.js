/**
 * Verify Supabase Database Setup
 *
 * This script verifies that all tables and RLS policies are correctly set up.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

console.log('\n' + '='.repeat(70));
console.log('  SUPABASE DATABASE VERIFICATION');
console.log('='.repeat(70) + '\n');

async function verifyDatabase() {
  const tables = [
    { name: 'user_profiles', description: 'User profiles and gamification' },
    { name: 'workbook_progress', description: 'Workbook exercise tracking' },
    { name: 'journal_entries', description: 'Journal entries with AI analysis' },
    { name: 'ai_conversations', description: 'AI Monk Mentor conversations' },
    { name: 'subscription_status', description: 'Whop subscription tracking' }
  ];

  let allTablesExist = true;
  let rlsEnabled = true;

  console.log('Checking tables...\n');

  for (const table of tables) {
    try {
      // Try to query the table (with limit 0 to just check existence)
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(0);

      if (error) {
        if (error.code === '42P01') {
          console.log(`  ✗ ${table.name.padEnd(25)} NOT FOUND`);
          console.log(`    ${table.description}`);
          allTablesExist = false;
        } else if (error.message.includes('row-level security')) {
          console.log(`  ✓ ${table.name.padEnd(25)} EXISTS (RLS active)`);
        } else {
          console.log(`  ? ${table.name.padEnd(25)} ERROR: ${error.message.substring(0, 50)}`);
        }
      } else {
        console.log(`  ✓ ${table.name.padEnd(25)} EXISTS`);
      }
    } catch (error) {
      console.log(`  ✗ ${table.name.padEnd(25)} ERROR: ${error.message}`);
      allTablesExist = false;
    }
  }

  console.log('\n' + '='.repeat(70) + '\n');

  if (allTablesExist) {
    console.log('✓ All tables exist!\n');

    // Try to insert a test record to verify RLS
    console.log('Testing Row-Level Security...\n');

    try {
      // This should fail because we're not setting the RLS context
      const { error } = await supabase
        .from('user_profiles')
        .insert([{
          whop_user_id: 'test_user',
          email: 'test@example.com',
          display_name: 'Test User'
        }]);

      if (error) {
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          console.log('  ✓ RLS is active - unauthorized inserts are blocked\n');
        } else {
          console.log('  ⚠ Unexpected error:', error.message.substring(0, 100));
          console.log('  RLS might not be configured correctly\n');
          rlsEnabled = false;
        }
      } else {
        console.log('  ⚠ WARNING: Insert succeeded without RLS context');
        console.log('  RLS might not be enabled!\n');
        rlsEnabled = false;

        // Clean up test record
        await supabase
          .from('user_profiles')
          .delete()
          .eq('whop_user_id', 'test_user');
      }
    } catch (error) {
      console.log('  ✗ Error testing RLS:', error.message);
      rlsEnabled = false;
    }

    console.log('='.repeat(70) + '\n');

    if (rlsEnabled) {
      console.log('✓ DATABASE SETUP COMPLETE\n');
      console.log('All tables exist and RLS is properly configured.\n');
      console.log('Next steps:');
      console.log('  1. Continue with application development');
      console.log('  2. Set up Whop OAuth integration');
      console.log('  3. Test the database with real user data\n');
    } else {
      console.log('⚠ DATABASE SETUP INCOMPLETE\n');
      console.log('Tables exist but RLS may not be configured correctly.\n');
      console.log('Action required:');
      console.log('  1. Check RLS policies in Supabase dashboard');
      console.log('  2. Re-run the migration SQL file');
      console.log('  3. Verify policies are created for all tables\n');
    }

  } else {
    console.log('✗ DATABASE SETUP INCOMPLETE\n');
    console.log('Some tables are missing. Please run the migration:\n');
    console.log('  1. Open: https://supabase.com/dashboard/project/' +
      supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] + '/sql/new');
    console.log('  2. Copy contents of: supabase/migrations/20251031_initial_schema.sql');
    console.log('  3. Paste and click "Run"\n');
  }

  console.log('='.repeat(70) + '\n');
}

verifyDatabase().catch(error => {
  console.error('\nVerification failed:', error.message);
  process.exit(1);
});
