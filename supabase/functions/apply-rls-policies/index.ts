import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'

serve(async (req) => {
  try {
    const dbUrl = Deno.env.get('DB_URL') ?? ''
    const client = new Client(dbUrl)
    await client.connect()

    // Execute RLS policies one by one
    const statements = [
      'ALTER TABLE job_files ENABLE ROW LEVEL SECURITY;',
      'DROP POLICY IF EXISTS "Allow anonymous users to read job files" ON job_files;',
      'DROP POLICY IF EXISTS "Allow anonymous users to insert job files" ON job_files;',
      'DROP POLICY IF EXISTS "Allow authenticated users full access to job files" ON job_files;',
      'CREATE POLICY "Allow anonymous users to read job files" ON job_files FOR SELECT TO anon USING (true);',
      'CREATE POLICY "Allow anonymous users to insert job files" ON job_files FOR INSERT TO anon WITH CHECK (true);',
      'CREATE POLICY "Allow authenticated users full access to job files" ON job_files FOR ALL TO authenticated USING (true) WITH CHECK (true);'
    ]

    const results = []
    for (const statement of statements) {
      const result = await client.queryObject(statement)
      results.push({ statement, rowCount: result.rowCount })
    }

    await client.end()

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
