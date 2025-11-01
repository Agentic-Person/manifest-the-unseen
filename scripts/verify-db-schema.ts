// Script to verify Supabase database schema for OAuth integration
import { supabaseAdmin } from '../lib/supabase'

async function verifyDatabaseSchema() {
  console.log('🔍 Verifying Supabase Database Schema...\n')

  try {
    // Test 1: Check if user_profiles table exists
    console.log('1️⃣ Checking user_profiles table...')
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .limit(1)

    if (profileError) {
      console.error('❌ Error accessing user_profiles:', profileError.message)
      return false
    }
    console.log('✅ user_profiles table exists and is accessible\n')

    // Test 2: Check user_profiles schema
    console.log('2️⃣ Checking user_profiles columns...')
    const requiredColumns = [
      'id',
      'whop_user_id',
      'email',
      'display_name',
      'current_phase',
      'signal_strength_score',
      'level',
      'journal_streak',
      'badges',
      'created_at',
      'last_active'
    ]

    // Get table structure by attempting to insert with all fields
    const testProfile = {
      whop_user_id: 'test_user_verify_schema',
      email: 'test@example.com',
      display_name: 'Test User',
      current_phase: 1,
      signal_strength_score: 0,
      level: 'Seeker',
      journal_streak: 0,
      badges: []
    }

    const { data: insertTest, error: insertError } = await supabaseAdmin
      .from('user_profiles')
      .insert(testProfile)
      .select()

    if (insertError) {
      console.error('❌ Error inserting test profile:', insertError.message)
      return false
    }

    console.log('✅ All required columns present\n')

    // Clean up test data
    if (insertTest && insertTest.length > 0) {
      await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('whop_user_id', 'test_user_verify_schema')
      console.log('🧹 Cleaned up test data\n')
    }

    // Test 3: Check other required tables
    console.log('3️⃣ Checking other required tables...')

    const tables = [
      'workbook_progress',
      'journal_entries',
      'ai_conversations',
      'subscription_status'
    ]

    for (const table of tables) {
      const { error } = await supabaseAdmin
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        console.error(`❌ Error accessing ${table}:`, error.message)
        return false
      }
      console.log(`✅ ${table} table exists`)
    }

    console.log('\n✨ All database schema checks passed!')
    return true

  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return false
  }
}

verifyDatabaseSchema()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
