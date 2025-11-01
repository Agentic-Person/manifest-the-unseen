# Database Migration Instructions

## Running the Initial Schema Migration

The database schema needs to be applied to your Supabase project before the OAuth integration can work properly.

### Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr

2. Navigate to the SQL Editor:
   - Click on "SQL Editor" in the left sidebar
   - Or go directly to: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/sql

3. Create a new query:
   - Click "New query" button
   - Copy the entire contents of `supabase/migrations/20251031_initial_schema.sql`
   - Paste into the SQL editor

4. Execute the migration:
   - Click "Run" or press Ctrl+Enter
   - Wait for the query to complete
   - You should see "Success" message

5. Verify tables were created:
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - user_profiles
     - workbook_progress
     - journal_entries
     - ai_conversations
     - subscription_status

### Method 2: Supabase CLI (Alternative)

If you have the Supabase project linked locally:

```bash
# Link to your Supabase project (if not already linked)
npx supabase link --project-ref zbyszxtwzoylyygtexdr

# Run migrations
npx supabase db push

# Or apply specific migration
npx supabase db push --include-all
```

### Verification

After running the migration, verify it worked by running:

```bash
npx tsx scripts/verify-db-schema.ts
```

You should see all tables marked as "EXISTS" with green checkmarks.

## What the Migration Creates

The initial schema creates:

### Tables

1. **user_profiles** - Core user data and progress tracking
   - Stores Whop user ID, current phase, level, streaks, badges
   - Created automatically when user first logs in via OAuth

2. **workbook_progress** - Tracks completion of 200+ workbook exercises
   - Links to user_profiles via foreign key
   - Stores exercise data and completion status

3. **journal_entries** - User journaling with AI analysis
   - 4 journal types: gratitude, vision, frequency, breakthrough
   - Stores AI-generated insights

4. **ai_conversations** - AI Monk Mentor conversation history
   - Stores message arrays in JSONB format
   - Used for context-aware AI responses

5. **subscription_status** - Whop subscription tracking
   - Synced via webhook handlers
   - Tracks active, cancelled, expired, trialing statuses

### Row-Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only see their own data
- Multi-tenant isolation (no cross-user data access)
- Service role can perform admin operations

### Indexes

Optimized indexes on:
- Foreign keys (user_id)
- Frequently queried columns (whop_user_id, created_at)
- Status fields for filtering

### Triggers

Auto-updating timestamps on all tables via `updated_at` column.

## Troubleshooting

### "Table already exists" errors

If you see errors about tables already existing:
1. This is normal if re-running the migration
2. The script will continue and verify table existence
3. If some tables are missing, you may need to drop and recreate

### Permission denied errors

Make sure you're using the service role key, not the anon key:
- Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY` set
- The service role key bypasses RLS

### Connection errors

If you can't connect to the database:
1. Verify your Supabase project is active
2. Check the connection details in the Supabase dashboard
3. Ensure your IP is not blocked (Supabase has IP allowlisting)

## Next Steps

After the migration is complete:
1. Test the OAuth flow: `/customer/test` should redirect to Whop login
2. User profiles will be created automatically on first login
3. Verify RLS is working by attempting to access another user's data
