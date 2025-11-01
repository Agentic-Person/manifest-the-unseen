/**
 * Setup Supabase Database
 *
 * This script sets up the database by executing SQL via Supabase client.
 * Since the Supabase client doesn't support raw SQL execution via REST API,
 * this script will guide you through the manual setup process.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log('\n' + '='.repeat(70));
console.log('  SUPABASE DATABASE SETUP - Manual Migration Required');
console.log('='.repeat(70) + '\n');

if (!projectRef) {
  console.error('ERROR: Could not find Supabase project reference');
  process.exit(1);
}

console.log('Your Supabase Project: ' + projectRef);
console.log('\nThe migration SQL file is ready at:');
console.log('  supabase/migrations/20251031_initial_schema.sql\n');

console.log('='.repeat(70));
console.log('  OPTION 1: Use Supabase Dashboard (Recommended)');
console.log('='.repeat(70) + '\n');

console.log('1. Open the Supabase SQL Editor:');
console.log('   https://supabase.com/dashboard/project/' + projectRef + '/sql/new\n');

console.log('2. Copy the migration file contents:');
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251031_initial_schema.sql');
const sql = fs.readFileSync(migrationPath, 'utf8');
console.log('   File: supabase/migrations/20251031_initial_schema.sql');
console.log('   Size: ' + sql.length + ' characters\n');

console.log('3. Paste the entire contents into the SQL Editor\n');

console.log('4. Click the "Run" button\n');

console.log('5. Verify that all 5 tables were created:\n');
const tables = [
  'user_profiles',
  'workbook_progress',
  'journal_entries',
  'ai_conversations',
  'subscription_status'
];

tables.forEach(table => {
  console.log('   - ' + table);
});

console.log('\n' + '='.repeat(70));
console.log('  OPTION 2: Use Supabase CLI (Advanced)');
console.log('='.repeat(70) + '\n');

console.log('1. Install Supabase CLI:');
console.log('   npm install -g supabase\n');

console.log('2. Link to your project:');
console.log('   supabase link --project-ref ' + projectRef + '\n');

console.log('3. Apply the migration:');
console.log('   supabase db push\n');

console.log('='.repeat(70));
console.log('  WHAT THIS MIGRATION CREATES');
console.log('='.repeat(70) + '\n');

console.log('Tables:');
console.log('  ✓ user_profiles        - User data and gamification tracking');
console.log('  ✓ workbook_progress    - Exercise completion tracking (10 phases)');
console.log('  ✓ journal_entries      - Journal entries with AI analysis');
console.log('  ✓ ai_conversations     - AI Monk Mentor chat history');
console.log('  ✓ subscription_status  - Whop subscription tracking\n');

console.log('Security:');
console.log('  ✓ Row-Level Security (RLS) enabled on all tables');
console.log('  ✓ Multi-tenant isolation (users can only see own data)');
console.log('  ✓ Policies for SELECT, INSERT, UPDATE, DELETE\n');

console.log('Performance:');
console.log('  ✓ Indexes on frequently queried columns');
console.log('  ✓ Foreign key relationships with CASCADE delete');
console.log('  ✓ Auto-update triggers for updated_at timestamps\n');

console.log('='.repeat(70));
console.log('  AFTER RUNNING THE MIGRATION');
console.log('='.repeat(70) + '\n');

console.log('Run this command to verify the setup:');
console.log('  node scripts/verify-database.js\n');

console.log('Or check the database directly:');
console.log('  https://supabase.com/dashboard/project/' + projectRef + '/editor\n');

console.log('='.repeat(70) + '\n');

// Write a quick reference guide
const quickRefPath = path.join(__dirname, '..', 'MIGRATION-INSTRUCTIONS.md');
const quickRef = `# Supabase Database Migration Instructions

## Quick Start

1. **Open Supabase SQL Editor**
   \`\`\`
   https://supabase.com/dashboard/project/${projectRef}/sql/new
   \`\`\`

2. **Copy the migration SQL**
   - File: \`supabase/migrations/20251031_initial_schema.sql\`
   - Paste the entire contents into the SQL Editor

3. **Click "Run"**

4. **Verify tables created**
   - Go to Table Editor: https://supabase.com/dashboard/project/${projectRef}/editor
   - You should see 5 tables: user_profiles, workbook_progress, journal_entries, ai_conversations, subscription_status

## What Gets Created

### Tables (5)
- \`user_profiles\` - User data and gamification tracking
- \`workbook_progress\` - Exercise completion across 10 phases
- \`journal_entries\` - Journal entries with AI analysis
- \`ai_conversations\` - AI Monk Mentor chat history
- \`subscription_status\` - Whop subscription tracking

### Security
- Row-Level Security (RLS) enabled on all tables
- Multi-tenant isolation via RLS policies
- Users can only access their own data

### Performance Features
- Indexes on frequently queried columns
- Foreign key relationships with CASCADE delete
- Auto-update triggers for \`updated_at\` timestamps

## Verification

After running the migration, verify the setup:

\`\`\`bash
node scripts/verify-database.js
\`\`\`

Or check manually in the Supabase dashboard:
- Table Editor: https://supabase.com/dashboard/project/${projectRef}/editor
- SQL Editor: https://supabase.com/dashboard/project/${projectRef}/sql

## Troubleshooting

**If you see "relation already exists" errors:**
- This means tables are already created
- You can safely ignore these errors
- Or drop the existing tables first:
  \`\`\`sql
  DROP TABLE IF EXISTS subscription_status CASCADE;
  DROP TABLE IF EXISTS ai_conversations CASCADE;
  DROP TABLE IF EXISTS journal_entries CASCADE;
  DROP TABLE IF EXISTS workbook_progress CASCADE;
  DROP TABLE IF EXISTS user_profiles CASCADE;
  \`\`\`

**If RLS policies fail:**
- Check that the tables exist first
- RLS policies depend on tables being created
- You can re-run just the RLS policy section

## Next Steps

After successful migration:
1. Run verification: \`node scripts/verify-database.js\`
2. Test the database connection: \`node scripts/test-db-connection.js\`
3. Continue with development tasks
`;

fs.writeFileSync(quickRefPath, quickRef);
console.log('Quick reference guide created: MIGRATION-INSTRUCTIONS.md\n');
