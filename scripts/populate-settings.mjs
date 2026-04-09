/**
 * populate-settings.mjs
 * Run: node scripts/populate-settings.mjs
 * Requires: SANITY_API_TOKEN in .env.local  (or set it inline below)
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local ────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '../.env.local')
const env = {}
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) env[k.trim()] = v.join('=').trim()
  })
} catch {}

const TOKEN   = env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN
const PROJECT = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wq48qcpb'

if (!TOKEN) {
  console.error('❌  SANITY_API_TOKEN not found in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

// ── Data to set ────────────────────────────────────────────────────────────
const SETTINGS_PATCH = {
  phone:          '0886678787',
  instagramUrl:   'https://www.instagram.com/thehighendbar/',
  facebookUrl:    'https://www.facebook.com/highendbar',
  googleReviewUrl:'https://maps.app.goo.gl/j9ZdJEWmmGHNrvQH8',
  // tiktokUrl:   — empty, left out intentionally
  workingHours: [
    { _type: 'object', _key: 'mon', day: 'monday',    hours: '08:00 — 20:00' },
    { _type: 'object', _key: 'tue', day: 'tuesday',   hours: '08:00 — 20:00' },
    { _type: 'object', _key: 'wed', day: 'wednesday', hours: '08:00 — 20:00' },
    { _type: 'object', _key: 'thu', day: 'thursday',  hours: '08:00 — 20:00' },
    { _type: 'object', _key: 'fri', day: 'friday',    hours: '08:00 — 20:00' },
  ],
}

async function run() {
  // Find existing siteSettings doc
  const existing = await client.fetch(`*[_type == "siteSettings"][0]{_id}`)

  if (!existing?._id) {
    console.error('❌  No siteSettings document found. Please create one in Studio first.')
    process.exit(1)
  }

  console.log(`✅  Found siteSettings: ${existing._id}`)
  console.log('📝  Patching...')

  await client.patch(existing._id).set(SETTINGS_PATCH).commit()

  console.log('✅  Settings updated successfully!')
  console.log('   - phone:          0886678787')
  console.log('   - Instagram:      https://www.instagram.com/thehighendbar/')
  console.log('   - Facebook:       https://www.facebook.com/highendbar')
  console.log('   - Google Review:  https://maps.app.goo.gl/j9ZdJEWmmGHNrvQH8')
  console.log('   - Working hours:  Mon–Fri 08:00–20:00')
}

run().catch(err => {
  console.error('❌  Error:', err.message)
  process.exit(1)
})
