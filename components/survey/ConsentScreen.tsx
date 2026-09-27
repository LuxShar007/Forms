'use client';
// components/survey/ConsentScreen.tsx

import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

const CONSENT_TEXT =
  "We're collecting your responses to understand how people experience music and what they expect from future music experiences. Your name and email may be used to identify your response and contact you only where you have explicitly opted into future research.";

interface Props {
  onAccept: () => void;
  consentChecked: boolean;
  onToggleConsent: () => void;
}

export default function ConsentScreen({ onAccept, consentChecked, onToggleConsent }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 10 }}
    >
      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '14px',
          background: 'rgba(124, 58, 237, 0.12)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <Shield size={24} color="#a78bfa" />
      </div>

      <h2
        style={{
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '14px',
          lineHeight: 1.25,
        }}
      >
        Before we begin
      </h2>

      <p
        style={{
          fontSize: 'clamp(0.875rem, 2.5vw, 0.95rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '28px',
        }}
      >
        {CONSENT_TEXT}
      </p>

      {/* Consent checkbox */}
      <label
        htmlFor="consent-checkbox"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          padding: '16px 18px',
          background: consentChecked
            ? 'rgba(124, 58, 237, 0.08)'
            : 'var(--surface-glass)',
          border: consentChecked
            ? '1px solid rgba(124, 58, 237, 0.3)'
            : '1px solid var(--border-subtle)',
          borderRadius: '12px',
          cursor: 'pointer',
          marginBottom: '28px',
          transition: 'all 0.2s',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ paddingTop: '2px', flexShrink: 0 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '6px',
              border: consentChecked ? '2px solid #7c3aed' : '2px solid var(--border-medium)',
              background: consentChecked ? '#7c3aed' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {consentChecked && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <input
          id="consent-checkbox"
          type="checkbox"
          checked={consentChecked}
          onChange={onToggleConsent}
          style={{ display: 'none' }}
          aria-label="I agree to participate in this research"
        />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, userSelect: 'none' }}>
          I agree to participate in this research.
        </span>
      </label>

      <button
        onClick={onAccept}
        disabled={!consentChecked}
        className="shiny-cta shiny-cta-full"
        style={{ marginTop: '0' }}
      >
        <span>
          Begin the study
          <ArrowRight size={18} />
        </span>
      </button>
    </motion.div>
  );
}
