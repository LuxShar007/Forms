// app/api/admin/auth/route.ts
// Handles admin session authentication and logout

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, isDemo } = await request.json();

    // Check for demo / evaluator credentials or explicit demo toggle
    if (
      isDemo ||
      (email === 'admin@forms.com' && password === 'admin123!') ||
      (email === 'admin@cubet.space' && password === 'cubet2026!') ||
      (email === 'researcher@cubet.space' && password === 'cubet2026!')
    ) {
      const response = NextResponse.json({
        success: true,
        user: { email: email || 'admin@cubet.space', role: 'admin', isDemo: true },
      });

      // Set admin session cookie (HTTP only, 24h expiration)
      response.cookies.set('cubet_admin_session', 'authenticated_cubet_researcher', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    // Attempt Supabase Auth
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return NextResponse.json(
          { error: error?.message || 'Invalid credentials' },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        success: true,
        user: { email: data.user.email, role: 'admin', isDemo: false },
      });

      response.cookies.set('cubet_admin_session', data.session?.access_token || 'authenticated_cubet_researcher', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });

      return response;
    } catch {
      return NextResponse.json(
        { error: 'Invalid credentials or database uninitialized. Use Demo Access for instant preview.' },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('cubet_admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
