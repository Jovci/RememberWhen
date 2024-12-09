// utils/supabaseClient.ts
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

const getSupabaseClient = (): SupabaseClient => {
  if (!supabase) {
    supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  return supabase;
};

export default getSupabaseClient;
