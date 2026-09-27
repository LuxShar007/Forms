// app/api/admin/stats/route.ts
// KPI statistics for admin dashboard

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
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceRoleClient();

      const { count: total } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true });

      if (total && total > 0) {
        const { count: completed } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .not('submitted_at', 'is', null);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: todayCount } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .gte('submitted_at', today.toISOString());

        const { data: timingData } = await supabase
          .from('survey_responses')
          .select('completion_time_seconds')
          .not('completion_time_seconds', 'is', null);

        const avgTime = timingData && timingData.length > 0
          ? Math.round(
              timingData.reduce((sum: number, r: { completion_time_seconds: number | null }) => sum + (r.completion_time_seconds ?? 0), 0) /
                timingData.length
            )
          : null;

        const { count: optIns } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .eq('future_research_opt_in', true);

        return NextResponse.json({
          total: total ?? 0,
          completed: completed ?? 0,
          today: todayCount ?? 0,
          avgCompletionSeconds: avgTime,
          futureOptIns: optIns ?? 0,
          isLive: true,
        });
      }
    } catch {
      // Fall back
    }
  }

  const localItems = getLocalResponses();
  const allItems = [...localItems, ...MOCK_RESPONSES];
  const total = allItems.length;
  const completed = total;
  const avgCompletionSeconds = Math.round(
    allItems.reduce((sum, r) => sum + (r.completion_time_seconds ?? 0), 0) / (total || 1)
  );
  const futureOptIns = allItems.filter((r) => r.future_research_opt_in).length;

  return NextResponse.json({
    total,
    completed,
    today: Math.max(localItems.length, 1),
    avgCompletionSeconds,
    futureOptIns,
    isLive: false,
  });
}
