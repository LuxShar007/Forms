'use client';
// app/survey/page.tsx
// Main survey orchestrator — manages state, persistence, and flow

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CubetMusicField from '@/components/CubetMusicField';
import ConsentScreen from '@/components/survey/ConsentScreen';
import ParticipantInfoScreen from '@/components/survey/ParticipantInfoScreen';
import QuestionScreen from '@/components/survey/QuestionScreen';
import {
  SurveyState,
  ParticipantInfo,
  SurveyAnswers,
  SubmitSurveyPayload,
} from '@/lib/survey/types';
import {
  getOrCreateRespondentId,
  loadSurveyState,
  saveSurveyState,
  createInitialState,
  clearSurveyState,
} from '@/lib/survey/persistence';
import { SURVEY_QUESTIONS, SECTIONS } from '@/lib/survey/questions';

// Steps: 0 = consent, 1 = participant info, 2..N+1 = questions
const TOTAL_QUESTIONS = SURVEY_QUESTIONS.length;
const INFO_STEP = 1;
const FIRST_Q_STEP = 2;

function getQuestionIndex(step: number) {
  return step - FIRST_Q_STEP;
}

export default function SurveyPage() {
  const router = useRouter();
  const [state, setState] = useState<SurveyState | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize or restore state
  useEffect(() => {
    const respondentId = getOrCreateRespondentId();
    const saved = loadSurveyState();
    if (saved && saved.respondentId === respondentId) {
      setState(saved);
      setConsentChecked(saved.consentGiven);
      startTimeRef.current = saved.sessionStartedAt;
    } else {
      const fresh = createInitialState(respondentId);
      setState(fresh);
    }
  }, []);

  // Autosave on state changes (debounced)
  useEffect(() => {
    if (!state) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveSurveyState(state);
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  const updateState = useCallback((updates: Partial<SurveyState>) => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  // STEP 0 → consent accepted
  const handleConsentAccept = () => {
    if (!consentChecked) return;
    setDirection('forward');
    updateState({ consentGiven: true, currentStep: INFO_STEP });
  };

  // STEP 1 → participant info submitted
  const handleParticipantInfo = (info: ParticipantInfo) => {
    setDirection('forward');
    updateState({ participantInfo: info, currentStep: FIRST_Q_STEP });
  };

  // Question answer
  const handleAnswer = (
    questionId: string,
    selected: string | string[],
    text?: string
  ) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: { selected, text },
        },
      };
    });
  };

  // Navigate forward
  const handleNext = async () => {
    if (!state) return;
    const currentQIdx = getQuestionIndex(state.currentStep);

    // Last question?
    if (currentQIdx >= TOTAL_QUESTIONS - 1) {
      await handleSubmit();
      return;
    }

    setDirection('forward');
    updateState({ currentStep: state.currentStep + 1 });
  };

  // Navigate back
  const handleBack = () => {
    if (!state) return;
    if (state.currentStep <= 0) return;
    setDirection('backward');
    updateState({ currentStep: state.currentStep - 1 });
  };

  const handleSubmit = async () => {
    if (!state || !state.participantInfo) return;
    setSubmitting(true);
    setSubmitError(null);

    const completionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

    // Check if q23 opted in to future research
    const q23Answer = state.answers['q23']?.selected;
    const futureOptIn = q23Answer === 'yes';

    const payload: SubmitSurveyPayload = {
      respondentId: state.respondentId,
      participantInfo: state.participantInfo,
      answers: state.answers,
      completionTimeSeconds: completionTime,
      futureResearchOptIn: futureOptIn,
      surveyVersion: process.env.NEXT_PUBLIC_SURVEY_VERSION ?? '1.0',
    };

    try {
      const res = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? 'Failed to submit. Please try again.');
        setSubmitting(false);
        return;
      }

      // Success
      clearSurveyState();
      router.push('/thank-you');
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  if (!state) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface-bg)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '2px solid var(--border-subtle)',
            borderTop: '2px solid var(--cubet-purple)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  const currentQuestion = SURVEY_QUESTIONS[getQuestionIndex(state.currentStep)];
  const isConsentStep = state.currentStep === 0;
  const isInfoStep = state.currentStep === INFO_STEP;
  const isQuestionStep = state.currentStep >= FIRST_Q_STEP;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CubetMusicField />

      {/* Main content - Full screen centered without upper header */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 16px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <AnimatePresence mode="wait">
            {isConsentStep && (
              <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ConsentScreen
                  onAccept={handleConsentAccept}
                  consentChecked={consentChecked}
                  onToggleConsent={() => setConsentChecked((v) => !v)}
                />
              </motion.div>
            )}

            {isInfoStep && (
              <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ParticipantInfoScreen
                  initial={state.participantInfo}
                  onSubmit={handleParticipantInfo}
                />
              </motion.div>
            )}

            {isQuestionStep && currentQuestion && (
              <QuestionScreen
                key={state.currentStep}
                question={currentQuestion}
                answers={state.answers}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onBack={handleBack}
                questionIndex={getQuestionIndex(state.currentStep)}
                totalQuestions={TOTAL_QUESTIONS}
                totalSections={SECTIONS.length}
                direction={direction}
              />
            )}
          </AnimatePresence>

          {/* Submit error */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '20px',
                padding: '14px 18px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: '#f87171',
                textAlign: 'center',
              }}
            >
              {submitError}
            </motion.div>
          )}

          {/* Submitting overlay */}
          {submitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(8, 8, 16, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: '2px solid var(--border-subtle)',
                  borderTop: '2px solid var(--cubet-purple)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Submitting your responses...
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
