/**
 * Run Supabase Migration Script
 *
 * This script reads the SQL migration file and executes it against the Supabase database.
 * Used for initial database setup and schema updates.
 */

import { createClient } from '@supabase/supabase-js'
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

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function runMigration() {
  console.log('Starting database migration...\n')

  try {
    // Read the migration file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20251031_initial_schema.sql')
    const sql = readFileSync(migrationPath, 'utf-8')

    console.log('Migration file loaded:', migrationPath)
    console.log('File size:', sql.length, 'characters\n')

    // Execute the SQL
    console.log('Executing migration...')
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql })

    if (error) {
      // If the function doesn't exist, we'll execute statements individually
      if (error.message.includes('function') || error.message.includes('does not exist')) {
        console.log('Using alternative method: executing SQL statements individually...\n')
        await executeStatementsIndividually(sql)
      } else {
        throw error
      }
    } else {
      console.log('\nMigration completed successfully!')
      console.log('Result:', data)
    }

    // Verify tables were created
    await verifyTables()

  } catch (error) {
    console.error('\nMigration failed:', error)
    process.exit(1)
  }
}

async function executeStatementsIndividually(sql: string) {
  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements to execute\n`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]

    // Skip comments
    if (statement.startsWith('--') || statement.length === 0) {
      continue
    }

    console.log(`Executing statement ${i + 1}/${statements.length}...`)

    try {
      // Use the PostgreSQL REST API to execute raw SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceRoleKey,
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        },
        body: JSON.stringify({ sql_string: statement + ';' })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`Statement ${i + 1} note:`, errorText)
        // Continue even if there are errors (e.g., table already exists)
      } else {
        console.log(`Statement ${i + 1} executed successfully`)
      }
    } catch (error) {
      console.log(`Statement ${i + 1} note:`, error instanceof Error ? error.message : 'Unknown error')
      // Continue with next statement
    }
  }
}

async function verifyTables() {
  console.log('\nVerifying tables...')

  const tables = [
    'user_profiles',
    'workbook_progress',
    'journal_entries',
    'ai_conversations',
    'subscription_status'
  ]

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('count(*)')
      .limit(0)

    if (error) {
      console.log(`  - ${table}: NOT FOUND or ERROR`)
      console.log(`    Error: ${error.message}`)
    } else {
      console.log(`  - ${table}: EXISTS`)
    }
  }
}

// Run the migration
runMigration().catch(console.error)
