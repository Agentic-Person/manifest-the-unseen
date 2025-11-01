/**
 * Apply Supabase Migration using node-postgres
 *
 * This script uses the pg library to directly execute the migration SQL
 * against the Supabase PostgreSQL database.
 */

import { Client } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Extract connection details from Supabase URL
// Format: https://PROJECT_REF.supabase.co
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')

// Supabase connection string format
const connectionString = `postgresql://postgres.${projectRef}:${supabaseServiceRoleKey}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

async function applyMigration() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Connecting to Supabase PostgreSQL...')
    await client.connect()
    console.log('Connected successfully!\n')

    // Read the migration file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20251031_initial_schema.sql')
    const sql = readFileSync(migrationPath, 'utf-8')

    console.log('Migration file loaded:', migrationPath)
    console.log('File size:', sql.length, 'characters\n')

    // Execute the migration
    console.log('Executing migration...\n')
    await client.query(sql)

    console.log('✅ Migration executed successfully!\n')

    // Verify tables were created
    console.log('Verifying tables...')
    const tables = [
      'user_profiles',
      'workbook_progress',
      'journal_entries',
      'ai_conversations',
      'subscription_status'
    ]

    for (const table of tables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        );
      `, [table])

      const exists = result.rows[0].exists
      console.log(`  - ${table}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`)
    }

    console.log('\n🎉 Database migration completed successfully!')

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)

    if (error.message.includes('already exists')) {
      console.log('\n⚠️  Note: Some objects already exist. This may be normal if re-running the migration.')
      console.log('Verifying table existence...\n')

      // Still verify tables
      try {
        const tables = ['user_profiles', 'workbook_progress', 'journal_entries', 'ai_conversations', 'subscription_status']
        for (const table of tables) {
          const result = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables
              WHERE table_schema = 'public'
              AND table_name = $1
            );
          `, [table])

          const exists = result.rows[0].exists
          console.log(`  - ${table}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`)
        }
      } catch (verifyError) {
        console.error('Verification failed:', verifyError)
      }
    } else {
      process.exit(1)
    }
  } finally {
    await client.end()
    console.log('\nDatabase connection closed.')
  }
}

applyMigration().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
