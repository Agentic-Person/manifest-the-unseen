# Task 002 - Supabase Database Setup

**Status:** [ ] Not Started - REQUIRES SUPABASE MCP SERVER

**Week/Phase:** Week 1

**Agent:** Agent 2 - Backend Lead

**MCP Servers Used:**
- [ ] Whop MCP
- [X] Supabase MCP - **REQUIRED**
- [ ] Pipedream MCP
- [ ] Puppeteer MCP

---

### Description

Create the complete Supabase database schema for all four pillars. This includes user profiles, workbook progress, journal entries, AI conversations, and meditation tracking tables with proper relationships and Row-Level Security (RLS) policies.

---

### Technical Approach

Use **Supabase MCP Server** to create tables, relationships, and RLS policies. Configure real-time subscriptions for AI chat. Set up indexes for performance optimization.

---

### Implementation Steps

1. Create Supabase project (if not exists)
2. Use Supabase MCP to create `users` table
3. Create `user_profiles` table with gamification fields
4. Create `workbook_progress` table for exercise data
5. Create `journal_entries` table with AI analysis field
6. Create `ai_conversations` table for chat history
7. Create `meditation_history` table for tracking
8. Create `meditations` table for content library
9. Set up foreign key relationships
10. Configure RLS policies for multi-tenant security
11. Create indexes on frequently queried fields
12. Test queries and RLS enforcement

---

### Code/Files Created

**Database Schema (via Supabase MCP):**

```sql
-- Users (managed by Whop OAuth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whop_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profile & Progress
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  whop_user_id TEXT UNIQUE NOT NULL,
  current_phase INTEGER DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 10),
  signal_strength_score INTEGER DEFAULT 0 CHECK (signal_strength_score BETWEEN 0 AND 100),
  level TEXT DEFAULT 'Seeker',
  meditation_streak INTEGER DEFAULT 0,
  journal_streak INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workbook Exercise Completion
CREATE TABLE workbook_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL CHECK (phase BETWEEN 1 AND 10),
  exercise_key TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phase, exercise_key)
);

-- Journal Entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('freeForm', 'guided', 'scripting', 'signalTracker', 'worryJar', 'dream')),
  content TEXT NOT NULL,
  audio_url TEXT,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  linked_phase INTEGER CHECK (linked_phase BETWEEN 1 AND 10),
  linked_exercise TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Conversations
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meditation History
CREATE TABLE meditation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meditation_id UUID REFERENCES meditations(id),
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  duration_seconds INTEGER,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5)
);

-- Meditations Content Library
CREATE TABLE meditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('foundation', 'daily', 'specialized', 'ambient')),
  audio_url TEXT NOT NULL,
  transcript TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  related_phase INTEGER CHECK (related_phase BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_workbook_user_phase ON workbook_progress(user_id, phase);
CREATE INDEX idx_journal_user_created ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_journal_type ON journal_entries(type);
CREATE INDEX idx_ai_conv_user ON ai_conversations(user_id);
CREATE INDEX idx_meditation_history_user ON meditation_history(user_id, played_at DESC);
CREATE INDEX idx_meditations_category ON meditations(category);
```

**RLS Policies:**

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workbook progress" ON workbook_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own journals" ON journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own AI conversations" ON ai_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own meditation history" ON meditation_history
  FOR ALL USING (auth.uid() = user_id);

-- Meditations are public (read-only)
CREATE POLICY "Anyone can view meditations" ON meditations
  FOR SELECT USING (TRUE);
```

**Files:**
- `lib/supabase.ts` - Supabase client configuration
- `types/database.types.ts` - TypeScript types generated from schema

---

### Testing Checklist

- [ ] All tables created successfully via Supabase MCP
- [ ] Foreign key relationships working
- [ ] RLS policies prevent unauthorized access
- [ ] Indexes improve query performance
- [ ] Real-time subscriptions functional
- [ ] Can insert/update/delete test data
- [ ] Multi-tenant isolation verified
- [ ] TypeScript types generated correctly

---

### Dependencies

**Blocked by:**
- Task 001 (Next.js initialization)
- Supabase MCP Server must be connected

**Blocks:**
- Task 004 (Whop OAuth - needs users table)
- All journal-related tasks
- All workbook-related tasks
- All meditation-related tasks
- AI conversation tasks

**External Dependencies:**
- Supabase account and project
- Supabase MCP Server connection
- `@supabase/supabase-js` package

---

### Notes for Junior Developer

**What needs to be built:**
The database is the foundation of the entire app. Every user action (journaling, completing workbook exercises, meditating, chatting with AI) needs to be stored securely with proper access controls.

**Why Supabase:**
- PostgreSQL-based (powerful, reliable)
- Built-in authentication integration with Whop
- Real-time subscriptions for AI chat
- Row-Level Security for multi-tenant architecture
- Generous free tier

**Multi-Tenant Security:**
Each Whop community is a tenant. Users from Community A should NEVER see data from Community B. RLS policies enforce this at the database level, so even if our application code has bugs, data stays isolated.

**Why JSONB fields:**
- `workbook_progress.data`: Each exercise has different fields (wheel of life vs. SWAT analysis). JSONB gives flexibility without schema changes.
- `journal_entries.ai_analysis`: AI returns varying insights. JSONB stores them without rigid structure.
- `user_profiles.badges`: Array of badge objects can grow over time.

**Index Strategy:**
- User-scoped queries need `user_id` indexes
- Time-based queries (journals, meditations) need timestamp indexes
- Category filters need category indexes

**Common pitfalls:**
1. **Forgetting RLS policies:** Without RLS, users can access all data. Always test with different user IDs.
2. **Missing indexes:** Queries work fine with 10 users, but slow down with 10,000. Add indexes early.
3. **JSONB query performance:** Querying deep into JSONB is slow. Keep flat structure when possible.
4. **Cascade deletes:** `ON DELETE CASCADE` means deleting a user deletes all their data. This is correct for GDPR compliance.

**Real-time Subscriptions:**
For AI chat, we'll use Supabase real-time to listen for new messages:
```typescript
supabase
  .channel('ai_chat')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'ai_conversations',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Update UI with new message
  })
  .subscribe();
```

**Future improvements:**
- Add full-text search indexes for journal content
- Set up database backups and point-in-time recovery
- Create database functions for complex queries
- Add triggers for auto-updating `updated_at` timestamps

**Resources:**
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL JSONB Docs](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

### Completion Notes

**Date Completed:** [Waiting for Supabase MCP Server]

**Time Spent:** [To be tracked]

**Final Status:** Not Started - Waiting for MCP Server connection

**Handoff Notes:**
⚠️ **CRITICAL:** This task REQUIRES Supabase MCP Server to be connected. Do not attempt to build this manually through the Supabase dashboard. The MCP server provides direct database access and validation.

Once Supabase MCP is connected:
1. Use MCP to create each table in order
2. Test each table creation before moving to next
3. Add RLS policies immediately after table creation
4. Generate TypeScript types from schema
5. Test multi-tenant isolation with multiple test users

This is a critical path task. Most other features depend on this being complete and correct.
