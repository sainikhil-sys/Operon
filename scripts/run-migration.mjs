import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=')
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim()
      }
    }
  })
}

async function applyMigration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('Supabase URL or Key missing')
    process.exit(1)
  }

  console.log('Connecting to Supabase at:', url)
  const supabase = createClient(url, key)

  console.log('Verifying connection to Supabase database...')
  const { count, error } = await supabase.from('organizations').select('*', { count: 'exact', head: true })

  if (error) {
    console.log('Database table check:', error.message)
  } else {
    console.log(`Database connection healthy! Organizations table accessible (count: ${count}).`)
  }
}

applyMigration()
