// Run migration SQL using Neon HTTP driver
import { neon, neonConfig } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

neonConfig.fetchFunction = fetch;

const DATABASE_URL = process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('NEON_DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigration() {
  const migrationFile = path.join(process.cwd(), 'db', 'migrations', '20260417_team_031_formasi_to_hub.sql');
  const migrationSQL = fs.readFileSync(migrationFile, 'utf-8');
  
  console.log('Running migration...');
  
  // Split by statement and execute
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const stmt of statements) {
    try {
      await sql`${stmt}`;
      console.log('✓ Executed:', stmt.substring(0, 50) + '...');
    } catch (err) {
      console.error('✗ Failed:', stmt.substring(0, 50), '-', err.message);
    }
  }
  
  console.log('Migration complete.');
}

runMigration().catch(console.error);
