'use client';
// components/survey/ParticipantInfoScreen.tsx

import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Calendar } from 'lucide-react';
import { ParticipantInfo } from '@/lib/survey/types';
import { useState } from 'react';

const AGE_RANGES = [
  'Under 16',
  '16–17',
  '18–20',
  '21–24',
  '25–29',
  '30–39',
  '40–49',
  '50+',
  'Prefer not to say',
];

interface Props {
  initial: ParticipantInfo | null;
  onSubmit: (info: ParticipantInfo) => void;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ParticipantInfoScreen({ initial, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [ageRange, setAgeRange] = useState(initial?.ageRange ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailTouched, setEmailTouched] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your name.';
    if (!email.trim()) e.email = 'Please enter your email.';
    else if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';
    if (!ageRange) e.ageRange = 'Please select your age range.';
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), ageRange });
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    minHeight: '44px',
    background: 'var(--surface-glass)',
    border: `1px solid ${hasError ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-subtle)'}`,
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '1rem', // Prevents iOS Safari auto-zoom on input focus
    color: 'var(--text-primary)',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: '520px', margin: '0 auto', position: 'relative', zIndex: 10 }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--cubet-purple-light)',
          marginBottom: '12px',
        }}
      >
        About you
      </p>

      <h2
        style={{
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}
      >
        Let&apos;s start with the basics
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '36px', lineHeight: 1.6 }}>
        We only collect what we need for this research.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Name */}
        <div>
          <label
            htmlFor="participant-name"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            <User size={13} />
            Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="participant-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Your full name"
            style={inputStyle(!!errors.name)}
            autoComplete="name"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.name ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.name && (
            <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '6px' }}>{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="participant-email"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            <Mail size={13} />
            Email <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="participant-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            onBlur={() => setEmailTouched(true)}
            placeholder="your@email.com"
            style={inputStyle(!!errors.email)}
            autoComplete="email"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
            }}
          />
          {emailTouched && email && !isValidEmail(email) && !errors.email && (
            <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '6px' }}>
              Please enter a valid email address.
            </p>
          )}
          {errors.email && (
            <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '6px' }}>{errors.email}</p>
          )}
        </div>

        {/* Age Range */}
        <div>
          <label
            htmlFor="participant-age"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '10px',
            }}
          >
            <Calendar size={13} />
            Age Range <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {AGE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => {
                  setAgeRange(range);
                  if (errors.ageRange) setErrors((prev) => ({ ...prev, ageRange: '' }));
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: ageRange === range
                    ? '1px solid rgba(124, 58, 237, 0.6)'
                    : '1px solid var(--border-subtle)',
                  background: ageRange === range
                    ? 'rgba(124, 58, 237, 0.15)'
                    : 'var(--surface-glass)',
                  color: ageRange === range ? '#a78bfa' : 'var(--text-secondary)',
                  fontSize: '0.825rem',
                  fontWeight: ageRange === range ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                {range}
              </button>
            ))}
          </div>
          {errors.ageRange && (
            <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '8px' }}>{errors.ageRange}</p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="shiny-cta shiny-cta-full"
        style={{ marginTop: '32px' }}
      >
        <span>
          Start the survey
          <ArrowRight size={18} />
        </span>
      </button>
    </motion.div>
  );
}
