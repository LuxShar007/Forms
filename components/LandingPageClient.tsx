'use client';
// components/LandingPageClient.tsx
// Simple, clean, minimalist landing page for the music opinion form

import { motion } from 'framer-motion';
import Link from 'next/link';
import CubetMusicField from './CubetMusicField';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';

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
          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 3.5rem)',
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
              marginBottom: '36px',
              maxWidth: '520px',
              margin: '0 auto 36px auto',
            }}
          >
            Share how you actually listen to music, how you discover new songs, and what frustrates you about current music apps.
          </p>

          {/* 3D Glass Animation Button (animation-button-3d.webflow.io) */}
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
            <Link href="/survey" className="shiny-cta">
              <span>
                Start Form
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>

          {/* Alternate Visible Meta Details */}
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-5 py-2.5 rounded-full bg-[#080812]/80 border border-white/15 backdrop-blur-xl shadow-xl text-xs sm:text-[13px] font-medium">
              <span className="flex items-center gap-1.5 text-[#c4b5fd]">
                <Clock size={14} className="text-[#a78bfa]" />
                <span>~3 to 4 mins</span>
              </span>
              <span className="text-white/25 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-[#6ee7b7]">
                <ShieldCheck size={14} className="text-[#34d399]" />
                <span>Anonymous & Private</span>
              </span>
              <span className="text-white/25 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-[#93c5fd]">
                <span>23 Quick Questions</span>
              </span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
