-- Manifest the Unseen MVP Database Schema
-- Created: 2025-10-31
-- Description: Initial schema for AI-powered manifestation coaching app

-- ============================================================================
-- TABLE 1: user_profiles
-- Core user data and gamification tracking
-- ============================================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whop_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  current_phase INTEGER DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 10),
  signal_strength_score INTEGER DEFAULT 0 CHECK (signal_strength_score BETWEEN 0 AND 100),
  level TEXT DEFAULT 'Seeker' CHECK (level IN ('Seeker', 'Practitioner', 'Advanced', 'Master')),
  journal_streak INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for user_profiles
CREATE INDEX idx_user_profiles_whop_user_id ON user_profiles(whop_user_id);
CREATE INDEX idx_user_profiles_last_active ON user_profiles(last_active);

-- ============================================================================
-- TABLE 2: workbook_progress
-- Track completion of workbook exercises across 10 phases
-- ============================================================================

CREATE TABLE workbook_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL CHECK (phase BETWEEN 1 AND 10),
  exercise_key TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phase, exercise_key)
);

-- Indexes for workbook_progress
CREATE INDEX idx_workbook_progress_user_id ON workbook_progress(user_id);
CREATE INDEX idx_workbook_progress_phase ON workbook_progress(phase);
CREATE INDEX idx_workbook_progress_completed ON workbook_progress(completed);

-- ============================================================================
-- TABLE 3: journal_entries
-- User journaling with AI analysis
-- ============================================================================

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('freeForm', 'guided', 'scripting')),
  content TEXT NOT NULL,
  ai_analysis JSONB,
  linked_phase INTEGER CHECK (linked_phase BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for journal_entries
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_type ON journal_entries(type);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);

-- ============================================================================
-- TABLE 4: ai_conversations
-- Store AI Monk Mentor conversation history
-- ============================================================================

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for ai_conversations
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_updated_at ON ai_conversations(updated_at DESC);

-- ============================================================================
-- TABLE 5: subscription_status
-- Track Whop subscription status for each user
-- ============================================================================

CREATE TABLE subscription_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  whop_membership_id TEXT UNIQUE NOT NULL,
  plan_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscription_status
CREATE INDEX idx_subscription_status_user_id ON subscription_status(user_id);
CREATE INDEX idx_subscription_status_whop_membership_id ON subscription_status(whop_membership_id);
CREATE INDEX idx_subscription_status_status ON subscription_status(status);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) SETUP
-- Enable RLS on all tables for multi-tenant security
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_status ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: user_profiles
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (whop_user_id = current_setting('app.whop_user_id', TRUE));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (whop_user_id = current_setting('app.whop_user_id', TRUE));

CREATE POLICY "Service role can insert user profiles"
  ON user_profiles FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES: workbook_progress
-- ============================================================================

CREATE POLICY "Users can view own workbook progress"
  ON workbook_progress FOR SELECT
  USING (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

CREATE POLICY "Users can insert own workbook progress"
  ON workbook_progress FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

CREATE POLICY "Users can update own workbook progress"
  ON workbook_progress FOR UPDATE
  USING (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

-- ============================================================================
-- RLS POLICIES: journal_entries
-- ============================================================================

CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  USING (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  USING (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

-- ============================================================================
-- RLS POLICIES: ai_conversations
-- ============================================================================

CREATE POLICY "Users can view own conversations"
  ON ai_conversations FOR SELECT
  USING (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

CREATE POLICY "Users can insert own conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

CREATE POLICY "Users can update own conversations"
  ON ai_conversations FOR UPDATE
  USING (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

-- ============================================================================
-- RLS POLICIES: subscription_status
-- ============================================================================

CREATE POLICY "Users can view own subscription"
  ON subscription_status FOR SELECT
  USING (user_id IN (SELECT id FROM user_profiles WHERE whop_user_id = current_setting('app.whop_user_id', TRUE)));

CREATE POLICY "Service role can manage subscriptions"
  ON subscription_status FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- Automatically update the updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workbook_progress_updated_at
  BEFORE UPDATE ON workbook_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_status_updated_at
  BEFORE UPDATE ON subscription_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
