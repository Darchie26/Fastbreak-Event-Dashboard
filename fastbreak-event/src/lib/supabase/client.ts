import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Hardcoded values as fallback - replace YOUR_ANON_KEY with your actual key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgwufqqqehpqfihieqwj.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnd3VmcXFxZWhwcWZpaGllcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNjg1NzcsImV4cCI6MjA3NjY0NDU3N30.JzeBvVSZqo4zCUS0kRzfbl3SRHUTsv7KtW4qlTeddgE'

  console.log('🔑 Supabase Client Config:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    url: supabaseUrl
  })

  if (!supabaseUrl || !supabaseKey || supabaseKey === 'YOUR_ANON_KEY_HERE') {
    throw new Error(
      'Your project\'s URL and Key are required to create a Supabase client! ' +
      'Check your Supabase project\'s API settings to find these values ' +
      'https://supabase.com/dashboard/project/_/settings/api'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}