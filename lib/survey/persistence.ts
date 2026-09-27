// lib/survey/persistence.ts
// Local storage autosave for survey progress

import { SurveyState } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'cubet_music_survey_state';
const RESPONDENT_KEY = 'cubet_respondent_id';

export function getOrCreateRespondentId(): string {
  if (typeof window === 'undefined') return uuidv4();
  
  let id = localStorage.getItem(RESPONDENT_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(RESPONDENT_KEY, id);
  }
  return id;
}

export function saveSurveyState(state: SurveyState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      lastSavedAt: Date.now(),
    }));
  } catch {
    // Ignore storage errors
  }
}

export function loadSurveyState(): SurveyState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as SurveyState;
    // Don't restore if already completed
    if (state.completed) return null;
    return state;
  } catch {
    return null;
  }
}

export function clearSurveyState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  // Keep respondent ID for duplicate detection
}

export function createInitialState(respondentId: string): SurveyState {
  return {
    respondentId,
    sessionStartedAt: Date.now(),
    participantInfo: null,
    consentGiven: false,
    answers: {},
    currentStep: 0,
    completed: false,
    lastSavedAt: Date.now(),
  };
}
