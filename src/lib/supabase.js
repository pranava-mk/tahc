import { createClient } from '@supabase/supabase-js'

// Singleton Supabase client for the browser.
// Creds come from Vite env (.env.local, gitignored):
//   VITE_SUPABASE_URL=https://tagiuunfgwdbaqeojmgo.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Fail loud in dev — a missing key silently breaks realtime + auth.
  console.error('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.local.example → .env.local.')
}

export const supabase = createClient(url, anonKey, {
  auth: {
    // Creator magic-link flow needs session persistence; anon users use sessionStorage.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})
