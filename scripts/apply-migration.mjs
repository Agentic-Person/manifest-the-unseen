// Script to apply database migration to Supabase
// Run with: node scripts/apply-migration.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function applyMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251031_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration to Supabase...');
    console.log('Project URL:', supabaseUrl);

    // Use the Supabase Management API or direct postgres connection
    // For now, we'll use fetch to execute via the SQL endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Migration failed:', error);
      process.exit(1);
    }

    const result = await response.json();
    console.log('\n✓ Migration completed successfully!');
    console.log('Result:', result);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
