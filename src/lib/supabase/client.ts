import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Safe to import in Client Components — only
 * uses the public URL and anon key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
