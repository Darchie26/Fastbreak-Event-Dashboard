import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use hardcoded values as fallback
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgwufqqqehpqfihieqwj.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnd3VmcXFxZWhwcWZpaGllcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNjg1NzcsImV4cCI6MjA3NjY0NDU3N30.JzeBvVSZqo4zCUS0kRzfbl3SRHUTsv7KtW4qlTeddgE'

  return createBrowserClient(supabaseUrl, supabaseKey)
}