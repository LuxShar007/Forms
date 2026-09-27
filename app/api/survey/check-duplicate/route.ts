// app/api/survey/check-duplicate/route.ts
// Check if email has already been used — called client-side before submission

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, getLocalResponses } from '@/lib/survey/localStore';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();

  // Check local responses first
  const localList = getLocalResponses();
  if (localList.some((r) => r.email === normalized)) {
    return NextResponse.json({ isDuplicate: true });
  }

  // Check Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceRoleClient();
      const { data } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('email', normalized)
        .limit(1)
        .single();

      return NextResponse.json({ isDuplicate: !!data });
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ isDuplicate: false });
}
