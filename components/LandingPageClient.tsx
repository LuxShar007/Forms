'use client';
// components/LandingPageClient.tsx
// Simple, clean, minimalist landing page for the music opinion form

import { motion } from 'framer-motion';
import Link from 'next/link';
import CubetMusicField from './CubetMusicField';
import { ArrowRight, Clock, ShieldCheck, Headphones } from 'lucide-react';

export default function LandingPageClient() {
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

      {/* Form Introduction - Full height centered without upper header */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '32px 20px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ maxWidth: '620px', width: '100%' }}
        >
          {/* Subtle Icon Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#c4b5fd',
              marginBottom: '24px',
            }}
          >
            <Headphones size={13} />
            <span>Community Feedback Form</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 7vw, 3.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '18px',
              color: '#ffffff',
            }}
          >
            Music Experience Survey
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '32px',
              maxWidth: '520px',
              margin: '0 auto 32px auto',
            }}
          >
            Share how you actually listen to music, how you discover new songs, and what frustrates you about current music apps.
          </p>

          {/* Start Button */}
          <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
            <Link href="/survey" style={{ textDecoration: 'none', width: '100%', maxWidth: '320px' }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '16px 28px',
                  borderRadius: '14px',
                  boxShadow: '0 4px 24px rgba(124, 58, 237, 0.4)',
                  cursor: 'pointer',
                  minHeight: '48px',
                  width: '100%',
                }}
              >
                <span>Start Form</span>
                <ArrowRight size={18} />
              </motion.div>
            </Link>
          </div>

          {/* Meta Details */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 18px',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} /> ~3 to 4 mins
            </span>
            <span className="hidden sm:inline">•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={13} /> Anonymous & Private
            </span>
            <span className="hidden sm:inline">•</span>
            <span>23 Quick Questions</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
