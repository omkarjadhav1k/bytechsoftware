import { createClient } from '@supabase/supabase-js'

// Try to get keys from Vite environment variables first, then default to live values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nhnraalsnjnurzygwdic.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_2bpFA0NK7XQqDSOnJkT9Jw_EYvl8hhe'

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
