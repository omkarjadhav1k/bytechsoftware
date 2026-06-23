import { createClient } from '@supabase/supabase-js'

// Try to get keys from Vite environment variables first
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Create client only if configuration is present
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any)

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase configuration keys (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing in environment. Running in LOCAL MOCK MODE."
  )
}
