// app/api/admin/export/route.ts
// CSV export of all survey responses

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { SURVEY_QUESTIONS } from '@/lib/survey/questions';
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

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = Array.isArray(value) ? value.join('; ') : String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let responses: any[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!error && data && data.length > 0) {
        responses = data;
      }
    } catch {
      // Fallback
    }
  }

  if (responses.length === 0) {
    const localItems = getLocalResponses();
    responses = [...localItems, ...MOCK_RESPONSES];
  }

  // Build CSV headers
  const questionHeaders = SURVEY_QUESTIONS.map(
    (q) => `Q${q.questionNumber}: ${q.text.slice(0, 50)}`
  );
  const textHeaders = SURVEY_QUESTIONS
    .filter((q) => q.optionalText || q.type === 'textarea')
    .map((q) => `Q${q.questionNumber}_text`);

  const headers = [
    'id',
    'name',
    'email',
    'age_range',
    'submitted_at',
    'completion_time_seconds',
    'future_research_opt_in',
    'survey_version',
    ...questionHeaders,
    ...textHeaders,
  ];

  const rows = (responses ?? []).map((r: {
    id: string;
    name: string;
    email: string;
    age_range: string;
    submitted_at: string;
    completion_time_seconds: number | null;
    future_research_opt_in: boolean;
    survey_version: string;
    answers: Record<string, { selected?: string | string[]; text?: string }>;
  }) => {
    const answerValues = SURVEY_QUESTIONS.map((q) => {
      const ans = r.answers?.[q.id];
      if (!ans) return '';
      return Array.isArray(ans.selected) ? ans.selected.join('; ') : (ans.selected ?? '');
    });

    const textValues = SURVEY_QUESTIONS
      .filter((q) => q.optionalText || q.type === 'textarea')
      .map((q) => r.answers?.[q.id]?.text ?? '');

    return [
      escapeCsvField(r.id),
      escapeCsvField(r.name),
      escapeCsvField(r.email),
      escapeCsvField(r.age_range),
      escapeCsvField(r.submitted_at),
      escapeCsvField(r.completion_time_seconds),
      escapeCsvField(r.future_research_opt_in),
      escapeCsvField(r.survey_version),
      ...answerValues.map(escapeCsvField),
      ...textValues.map(escapeCsvField),
    ].join(',');
  });

  const csv = [headers.map(escapeCsvField).join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cubet-study-responses-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
