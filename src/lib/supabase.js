import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if Supabase is properly configured
export const isSupabaseConfigured = supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase') &&
    !supabaseAnonKey.includes('your-supabase')

// Create a mock client if not configured to prevent crashes
const createMockClient = () => ({
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signUp: async () => { throw new Error('Supabase not configured') },
        signInWithPassword: async () => { throw new Error('Supabase not configured') },
        signOut: async () => ({ error: null }),
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                order: () => ({ data: [], error: null }),
                single: () => ({ data: null, error: null }),
            }),
        }),
        insert: () => ({ data: null, error: null }),
    }),
})

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient()
