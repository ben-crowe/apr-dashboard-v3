#!/usr/bin/env tsx
/**
 * Manually update ClickUp task with LOE Signed timestamp
 * 
 * Usage:
 *   tsx scripts/manually-update-clickup-loe-signed.ts <taskId> [signerName]
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ngovnamnjmexdpjtcnky.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ'
const CLICKUP_API_TOKEN = 'pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY'

const supabase = createClient(supabaseUrl, supabaseKey)

// Format timestamp like the webhook does
function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr)
  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${year}.${month}.${day} / ${hours}:${minutes} ${ampm}`
}

async function updateClickUpLOESigned(taskId: string, signerName: string = 'Client') {
  console.log(`📝 Updating ClickUp task ${taskId} with LOE Signed timestamp...\n`)

  // Fetch existing task
  const getTaskResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': CLICKUP_API_TOKEN,
      'Content-Type': 'application/json'
    }
  })

  if (!getTaskResponse.ok) {
    const errorText = await getTaskResponse.text()
    throw new Error(`Failed to fetch ClickUp task: ${getTaskResponse.status} - ${errorText}`)
  }

  const existingTask = await getTaskResponse.json()
  const existingDescription = existingTask.markdown_description || existingTask.description || ''

  console.log('Current description (LOE lines):')
  const loeLines = existingDescription.split('\n').filter((l: string) => l.includes('LOE'))
  loeLines.forEach((l: string) => console.log(`  ${l}`))
  console.log('')

  // Format timestamp
  const formattedTime = formatTimestamp(new Date().toISOString())
  const signedLine = `▸ LOE Signed: ${formattedTime} by ${signerName}`

  let updatedDescription = existingDescription

  // Replace blank LOE Signed line (handle both with and without leading spaces)
  if (existingDescription.includes('▸ LOE Signed:')) {
    // Match: "▸ LOE Signed:" or "  ▸ LOE Signed:" followed by optional whitespace and newline
    updatedDescription = existingDescription.replace(
      /^\s*▸ LOE Signed:\s*$/m,
      signedLine
    )
    console.log('✅ Replaced blank LOE Signed line')
  } else {
    // Fallback: Insert after "LOE Sent" line if not found
    if (existingDescription.includes('▸ LOE Sent:')) {
      // Match "LOE Sent:" line (with or without leading spaces) and insert after it
      updatedDescription = existingDescription.replace(
        /(^\s*▸ LOE Sent:.*?\n)/m,
        `$1${signedLine}\n`
      )
      console.log('✅ Inserted LOE Signed line after LOE Sent')
    } else {
      console.log('⚠️  Could not find LOE Sent or LOE Signed line - adding at top')
      updatedDescription = `${signedLine}\n\n${existingDescription}`
    }
  }

  // Update task
  const updateResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': CLICKUP_API_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: updatedDescription,
      markdown_description: updatedDescription
    })
  })

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text()
    throw new Error(`Failed to update ClickUp task: ${updateResponse.status} - ${errorText}`)
  }

  console.log('\n✅ ClickUp task updated successfully!')
  console.log(`\nUpdated line: ${signedLine}`)
}

// Get taskId from command line args
const taskId = process.argv[2]
const signerName = process.argv[3] || 'Client'

if (!taskId) {
  console.error('Usage: tsx scripts/manually-update-clickup-loe-signed.ts <taskId> [signerName]')
  console.error('Example: tsx scripts/manually-update-clickup-loe-signed.ts 86dyykm3m "Ben Crowe"')
  process.exit(1)
}

updateClickUpLOESigned(taskId, signerName).catch(console.error)
