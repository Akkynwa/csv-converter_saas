import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for use in Server Components, 
 * Server Actions, and Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // GET is always safe in Server Components
        getAll() {
          return cookieStore.getAll();
        },
        // SET and REMOVE are only functional in Actions/Route Handlers
        // Next.js will throw an error if called in a Server Component
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // This catch is necessary because Server Components 
            // cannot set cookies. The Middleware handles the 
            // session refresh instead.
          }
        },
      },
    }
  );
}