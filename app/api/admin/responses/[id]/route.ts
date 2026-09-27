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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return NextResponse.json({ response: data, isLive: true });
      }
    } catch {
      // Fallback below
    }
  }

  const localResponses = getLocalResponses();
  const all = [...localResponses, ...MOCK_RESPONSES];
  const found = all.find((r) => r.id === id);

  if (!found) {
    return NextResponse.json({ error: 'Response not found' }, { status: 404 });
  }

  return NextResponse.json({ response: found, isLive: false });
}
