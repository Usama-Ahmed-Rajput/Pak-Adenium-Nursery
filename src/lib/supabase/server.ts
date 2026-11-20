import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getServiceRoleKey(): string {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || serviceRoleKey.trim() === "" || serviceRoleKey === '""' || serviceRoleKey === "''") {
    throw new Error(
      "Missing or empty SUPABASE_SERVICE_ROLE_KEY environment variable. Server-side administrative operations require the service role key. Please ensure it is defined and saved in .env.local"
    );
  }
  return serviceRoleKey.trim();
}

function getSupabaseUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.trim() === "") {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please define it in .env.local"
    );
  }
  return supabaseUrl.trim();
}

let _supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdminInstance) {
    _supabaseAdminInstance = createClient(getSupabaseUrl(), getServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdminInstance;
}

/**
 * Administrative Supabase client powered by SUPABASE_SERVICE_ROLE_KEY.
 * Bypasses Row Level Security (RLS) for backend operations, atomic RPCs, and storage management.
 * Strictly throws if SUPABASE_SERVICE_ROLE_KEY is missing or invalid.
 */
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
