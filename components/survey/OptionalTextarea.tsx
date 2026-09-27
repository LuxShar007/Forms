'use client';
// components/survey/OptionalTextarea.tsx
// Expandable optional open-text area

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Props {
  prompt: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  alwaysVisible?: boolean;
}

export default function OptionalTextarea({
  prompt,
  value,
  onChange,
  placeholder = 'Share your thoughts...',
  alwaysVisible = false,
}: Props) {
  const [expanded, setExpanded] = useState(alwaysVisible || !!value);

  return (
    <div style={{ marginTop: '20px' }}>
      {!alwaysVisible && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontSize: '0.82rem',
            fontWeight: 500,
            padding: '4px 0',
            fontFamily: 'inherit',
            transition: 'color 0.2s',
          }}
          aria-expanded={expanded}
        >
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
          {prompt}
        </button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {alwaysVisible && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
                {prompt}
              </p>
            )}
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={3}
              style={{
                width: '100%',
                background: 'var(--surface-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
                resize: 'vertical',
                lineHeight: 1.6,
                marginTop: alwaysVisible ? 0 : '10px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none',
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
