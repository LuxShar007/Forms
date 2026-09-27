'use client';
// components/survey/QuestionScreen.tsx
// One-question-per-screen UI

import { motion, AnimatePresence } from 'framer-motion';
import { SurveyQuestion } from '@/lib/survey/questions';
import { SurveyAnswers } from '@/lib/survey/types';
import OptionButton from './OptionButton';
import OptionalTextarea from './OptionalTextarea';
import ProgressBar from './ProgressBar';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  question: SurveyQuestion;
  answers: SurveyAnswers;
  onAnswer: (questionId: string, selected: string | string[], text?: string) => void;
  onNext: () => void;
  onBack: () => void;
  questionIndex: number;   // 0-indexed
  totalQuestions: number;
  totalSections: number;
  direction: 'forward' | 'backward';
}

const variants = {
  enter: (dir: string) => ({
    x: dir === 'forward' ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: string) => ({
    x: dir === 'forward' ? -40 : 40,
    opacity: 0,
  }),
};

export default function QuestionScreen({
  question,
  answers,
  onAnswer,
  onNext,
  onBack,
  questionIndex,
  totalQuestions,
  totalSections,
  direction,
}: Props) {
  const current = answers[question.id];
  const selected = current?.selected;
  const textValue = current?.text ?? '';

  const isMulti = question.type === 'multi';
  const isTextarea = question.type === 'textarea';

  // For multi-select: array of strings
  const selectedArray: string[] = isMulti
    ? Array.isArray(selected) ? selected : []
    : [];

  // For single: one string
  const selectedSingle: string = !isMulti && typeof selected === 'string' ? selected : '';

  const maxReached = isMulti && question.maxSelect
    ? selectedArray.length >= question.maxSelect
    : false;

  const handleSingleSelect = (value: string) => {
    onAnswer(question.id, value, textValue);
  };

  const handleMultiToggle = (value: string) => {
    const newSelected = selectedArray.includes(value)
      ? selectedArray.filter((v) => v !== value)
      : maxReached
      ? selectedArray
      : [...selectedArray, value];
    onAnswer(question.id, newSelected, textValue);
  };

  const handleTextChange = (text: string) => {
    onAnswer(question.id, selected ?? (isMulti ? [] : ''), text);
  };

  const canContinue = !question.required || (
    isTextarea
      ? true
      : isMulti
      ? selectedArray.length > 0
      : !!selectedSingle
  );

  // Should show optional textarea?
  const showOptionalText = question.optionalText && (
    !question.showTextareaWhen ||
    (selectedSingle && question.showTextareaWhen.includes(selectedSingle))
  );

  return (
    <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ marginBottom: '40px' }}>
        <ProgressBar
          current={questionIndex + 1}
          total={totalQuestions}
          sectionTitle={question.sectionTitle}
          sectionNumber={question.section}
          totalSections={totalSections}
        />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={question.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform, opacity' }}
        >
          {/* Question number badge */}
          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--cubet-purple-light)',
              }}
            >
              Question {question.questionNumber}
            </span>
          </div>

          {/* Question text */}
          <h2
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              marginBottom: '8px',
            }}
          >
            {question.text}
          </h2>

          {/* Instruction for multi-select */}
          {isMulti && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '24px' }}>
              {question.maxSelect
                ? `Select up to ${question.maxSelect}`
                : 'Select all that apply'}
              {maxReached && (
                <span style={{ color: 'var(--cubet-purple-light)', marginLeft: '8px' }}>
                  · Maximum reached
                </span>
              )}
            </p>
          )}

          {!isMulti && !isTextarea && (
            <div style={{ marginBottom: '24px' }} />
          )}

          {/* Options */}
          {!isTextarea && question.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {question.options.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  selected={
                    isMulti
                      ? selectedArray.includes(opt.value)
                      : selectedSingle === opt.value
                  }
                  disabled={isMulti ? maxReached && !selectedArray.includes(opt.value) : false}
                  onClick={() =>
                    isMulti
                      ? handleMultiToggle(opt.value)
                      : handleSingleSelect(opt.value)
                  }
                  type={isMulti ? 'checkbox' : 'radio'}
                />
              ))}
            </div>
          )}

          {/* Big textarea for q20 */}
          {isTextarea && (
            <div style={{ marginBottom: '20px' }}>
              <textarea
                value={textValue}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={question.textareaPlaceholder ?? 'Share your thoughts...'}
                rows={6}
                style={{
                  width: '100%',
                  background: 'var(--surface-glass)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                  resize: 'vertical',
                  lineHeight: 1.7,
                  outline: 'none',
                  backdropFilter: 'blur(8px)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                Optional — you can leave this blank and continue.
              </p>
            </div>
          )}

          {/* Optional textarea */}
          {showOptionalText && (
            <OptionalTextarea
              prompt={question.optionalText!}
              value={textValue}
              onChange={handleTextChange}
            />
          )}

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '32px',
              gap: '12px',
            }}
          >
            <button
              onClick={onBack}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <motion.button
              onClick={onNext}
              disabled={!canContinue}
              whileHover={canContinue ? { scale: 1.02, y: -1 } : {}}
              whileTap={canContinue ? { scale: 0.98 } : {}}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: canContinue ? 'var(--cubet-purple)' : 'var(--surface-3)',
                color: canContinue ? 'white' : 'var(--text-tertiary)',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '12px 28px',
                borderRadius: '10px',
                border: 'none',
                cursor: canContinue ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
                boxShadow: canContinue ? '0 4px 20px rgba(124, 58, 237, 0.35)' : 'none',
              }}
            >
              Continue
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
