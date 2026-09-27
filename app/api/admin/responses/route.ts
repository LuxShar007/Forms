// app/api/admin/responses/route.ts
// Admin API: list/filter survey responses
// Protected: verifies auth + admin role server-side

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { MOCK_RESPONSES } from '@/lib/admin/mockData';
import { getLocalResponses, isSupabaseConfigured } from '@/lib/survey/localStore';

async function verifyAdmin(request: NextRequest) {
  const sessionCookie = request.cookies.get('cubet_admin_session');
  if (sessionCookie?.value) {
    return { id: 'admin', email: 'admin@cubet.space', role: 'admin' };
  }

  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const serviceClient = createServiceRoleClient();
    const { data: role } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    return role ? user : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 100);
  const offset = (page - 1) * limit;

  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const ageFilter = searchParams.get('age') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';

  // If Supabase is configured and has data, use Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceRoleClient();

      let query = supabase
        .from('survey_responses')
        .select('id, name, email, age_range, answers, submitted_at, completion_time_seconds, future_research_opt_in, survey_version', { count: 'exact' });

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      if (ageFilter) {
        query = query.eq('age_range', ageFilter);
      }

      if (sort === 'oldest') {
        query = query.order('submitted_at', { ascending: true });
      } else {
        query = query.order('submitted_at', { ascending: false });
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (!error && data && data.length > 0) {
        return NextResponse.json({ responses: data, total: count ?? data.length, page, limit, isLive: true });
      }
    } catch {
      // Graceful fallback
    }
  }

  // Merge local responses with mock responses
  const localItems = getLocalResponses();
  const allItems = [...localItems, ...MOCK_RESPONSES];

  let filtered = allItems;
  if (search) {
    filtered = filtered.filter(
      (r) => r.name.toLowerCase().includes(search) || r.email.toLowerCase().includes(search)
    );
  }
  if (ageFilter) {
    filtered = filtered.filter((r) => r.age_range === ageFilter);
  }
  if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  }

  const paged = filtered.slice(offset, offset + limit);
  return NextResponse.json({
    responses: paged,
    total: filtered.length,
    page,
    limit,
    isLive: false,
  });
}
