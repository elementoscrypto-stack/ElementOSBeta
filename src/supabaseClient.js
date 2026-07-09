import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }),
        signInWithPassword: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
        signUp: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") }),
        upsert: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      }),
    };
