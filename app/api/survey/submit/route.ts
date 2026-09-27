// app/api/survey/submit/route.ts
// Server-side API route for survey submission
// Uses Supabase service-role client when configured, with seamless local storage fallback

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { SubmitSurveyPayload } from '@/lib/survey/types';
import { isSupabaseConfigured, saveLocalResponse, getLocalResponses } from '@/lib/survey/localStore';

const DUPLICATE_POLICY = process.env.NEXT_PUBLIC_DUPLICATE_EMAIL_POLICY ?? 'warn';

export async function POST(request: NextRequest) {
  try {
    const body: SubmitSurveyPayload = await request.json();

    // Basic validation
    const { respondentId, participantInfo, answers, completionTimeSeconds, futureResearchOptIn, surveyVersion } = body;

    if (!respondentId || !participantInfo?.name || !participantInfo?.email || !participantInfo?.ageRange) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(participantInfo.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const emailNormalized = participantInfo.email.toLowerCase();

    // If Supabase is configured with real credentials, attempt remote database persistence
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceRoleClient();

        // Check for duplicate email
        const { data: existing } = await supabase
          .from('survey_responses')
          .select('id')
          .eq('email', emailNormalized)
          .limit(1)
          .single();

        if (existing && DUPLICATE_POLICY === 'block') {
          return NextResponse.json(
            { error: 'A response with this email has already been submitted.', duplicate: true },
            { status: 409 }
          );
        }

        // Upsert session
        await supabase
          .from('survey_sessions')
          .upsert(
            {
              respondent_id: respondentId,
              completed: true,
              completion_time_seconds: completionTimeSeconds,
              last_saved_at: new Date().toISOString(),
            },
            { onConflict: 'respondent_id' }
          );

        // Insert consent record
        await supabase.from('research_consents').insert({
          respondent_id: respondentId,
          consent_given: true,
          consent_text_version: '1.0',
        });

        // Insert response
        const { data: responseData, error: insertError } = await supabase
          .from('survey_responses')
          .insert({
            name: participantInfo.name,
            email: emailNormalized,
            age_range: participantInfo.ageRange,
            answers,
            survey_version: surveyVersion ?? '1.0',
            completion_time_seconds: completionTimeSeconds,
            future_research_opt_in: futureResearchOptIn,
            submitted_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (!insertError && responseData) {
          return NextResponse.json({
            success: true,
            responseId: responseData.id,
            duplicate: !!existing,
            storage: 'supabase',
          });
        }
      } catch (err) {
        console.warn('Supabase submission failed, falling back to local persistent store:', err);
      }
    }

    // Local persistent storage fallback
    const localId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const localList = getLocalResponses();
    const isDuplicate = localList.some((r) => r.email === emailNormalized);

    if (isDuplicate && DUPLICATE_POLICY === 'block') {
      return NextResponse.json(
        { error: 'A response with this email has already been submitted.', duplicate: true },
        { status: 409 }
      );
    }

    const saved = saveLocalResponse({
      id: localId,
      name: participantInfo.name,
      email: emailNormalized,
      age_range: participantInfo.ageRange,
      answers,
      survey_version: surveyVersion ?? '1.0',
      completion_time_seconds: completionTimeSeconds ?? null,
      future_research_opt_in: futureResearchOptIn ?? false,
      submitted_at: new Date().toISOString(),
    });

    if (!saved) {
      return NextResponse.json({ error: 'Failed to write response to storage.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      responseId: localId,
      duplicate: isDuplicate,
      storage: 'local',
    });
  } catch (err) {
    console.error('Survey submit error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
