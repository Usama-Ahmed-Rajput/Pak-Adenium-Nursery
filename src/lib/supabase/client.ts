import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== "undefined") {
    console.warn("Public Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing.");
  }
}

/**
 * Public client for client-side queries and subscriptions, constrained by RLS policies.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseClient = supabase;

