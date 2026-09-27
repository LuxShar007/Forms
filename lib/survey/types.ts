// lib/survey/types.ts
// Shared TypeScript types for the survey

export interface ParticipantInfo {
  name: string;
  email: string;
  ageRange: string;
}

export interface SurveyAnswers {
  [questionId: string]: {
    selected: string | string[];   // Single value or array for multi-select
    text?: string;                  // Optional written response
  };
}

export interface SurveyState {
  respondentId: string;
  sessionStartedAt: number;        // unix timestamp ms
  participantInfo: ParticipantInfo | null;
  consentGiven: boolean;
  answers: SurveyAnswers;
  currentStep: number;             // 0 = consent, 1 = participant info, 2+ = questions
  completed: boolean;
  lastSavedAt: number;
}

export interface SurveyResponse {
  id: string;
  name: string;
  email: string;
  age_range: string;
  answers: SurveyAnswers;
  survey_version: string;
  completion_time_seconds: number | null;
  future_research_opt_in: boolean;
  submitted_at: string;
  created_at: string;
}

export interface SubmitSurveyPayload {
  respondentId: string;
  participantInfo: ParticipantInfo;
  answers: SurveyAnswers;
  completionTimeSeconds: number;
  futureResearchOptIn: boolean;
  surveyVersion: string;
}
