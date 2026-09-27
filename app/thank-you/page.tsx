'use client';
// app/thank-you/page.tsx

import { motion } from 'framer-motion';
import Link from 'next/link';
import CubetMusicField from '@/components/CubetMusicField';
import { CheckCircle2, RotateCcw, Home } from 'lucide-react';

export default function ThankYouPage() {
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

      {/* Content - Full screen centered without upper header */}
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
          style={{ maxWidth: '480px', width: '100%' }}
        >
          {/* Success Check Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
            }}
          >
            <CheckCircle2 size={32} color="#34d399" />
          </motion.div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            Thank you!
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '36px',
            }}
          >
            Your response has been submitted and recorded. Thank you for taking the time to share your feedback with us.
          </p>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.875rem',
                padding: '11px 22px',
                borderRadius: '10px',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                transition: 'all 0.2s',
              }}
            >
              <Home size={15} />
              Return Home
            </Link>

            <Link
              href="/survey"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--cubet-purple)',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.875rem',
                padding: '11px 22px',
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              <RotateCcw size={15} />
              Submit Another Response
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
