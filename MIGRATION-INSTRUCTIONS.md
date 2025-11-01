# Supabase Database Migration Instructions

## Quick Start

1. **Open Supabase SQL Editor**
   ```
   https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/sql/new
   ```

2. **Copy the migration SQL**
   - File: `supabase/migrations/20251031_initial_schema.sql`
   - Paste the entire contents into the SQL Editor

3. **Click "Run"**

4. **Verify tables created**
   - Go to Table Editor: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/editor
   - You should see 5 tables: user_profiles, workbook_progress, journal_entries, ai_conversations, subscription_status

## What Gets Created

### Tables (5)
- `user_profiles` - User data and gamification tracking
- `workbook_progress` - Exercise completion across 10 phases
- `journal_entries` - Journal entries with AI analysis
- `ai_conversations` - AI Monk Mentor chat history
- `subscription_status` - Whop subscription tracking

### Security
- Row-Level Security (RLS) enabled on all tables
- Multi-tenant isolation via RLS policies
- Users can only access their own data

### Performance Features
- Indexes on frequently queried columns
- Foreign key relationships with CASCADE delete
- Auto-update triggers for `updated_at` timestamps

## Verification

After running the migration, verify the setup:

```bash
node scripts/verify-database.js
```

Or check manually in the Supabase dashboard:
- Table Editor: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/editor
- SQL Editor: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/sql

## Troubleshooting

**If you see "relation already exists" errors:**
- This means tables are already created
- You can safely ignore these errors
- Or drop the existing tables first:
  ```sql
  DROP TABLE IF EXISTS subscription_status CASCADE;
  DROP TABLE IF EXISTS ai_conversations CASCADE;
  DROP TABLE IF EXISTS journal_entries CASCADE;
  DROP TABLE IF EXISTS workbook_progress CASCADE;
  DROP TABLE IF EXISTS user_profiles CASCADE;
  ```

**If RLS policies fail:**
- Check that the tables exist first
- RLS policies depend on tables being created
- You can re-run just the RLS policy section

## Next Steps

After successful migration:
1. Run verification: `node scripts/verify-database.js`
2. Test the database connection: `node scripts/test-db-connection.js`
3. Continue with development tasks
