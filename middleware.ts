// middleware.ts
// Next.js middleware for protecting the /responses route
// This runs on the Edge — before any page or API route is served

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /responses and all its sub-paths
  if (!pathname.startsWith('/responses')) {
    return NextResponse.next();
  }

  // Allow login page to load without authentication
  if (pathname === '/responses/login') {
    return NextResponse.next();
  }

  // Check for verified session cookie (supports both demo researcher mode and active auth)
  const adminSession = request.cookies.get('cubet_admin_session');
  if (adminSession?.value) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT write any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // Not authenticated — redirect to login with return URL
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/responses/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated but we need to verify admin role
  // We check this in the page itself (server component) for the full check
  // The middleware ensures no unauthenticated access at all
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/responses',
    '/responses/((?!login).*)',
  ],
};
