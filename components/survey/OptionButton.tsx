'use client';
// components/survey/OptionButton.tsx
// Reusable button for single-select and multi-select survey options

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Props {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  type?: 'radio' | 'checkbox';
}

export default function OptionButton({
  label,
  selected,
  disabled = false,
  onClick,
  type = 'radio',
}: Props) {
  return (
    <motion.button
      whileHover={disabled && !selected ? {} : { scale: 1.01 }}
      whileTap={disabled && !selected ? {} : { scale: 0.99 }}
      onClick={onClick}
      disabled={disabled && !selected}
      aria-pressed={selected}
      style={{
        width: '100%',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '13px 16px',
        borderRadius: '12px',
        border: selected
          ? '1px solid rgba(124, 58, 237, 0.6)'
          : '1px solid var(--border-subtle)',
        background: selected
          ? 'rgba(124, 58, 237, 0.12)'
          : disabled
          ? 'transparent'
          : 'var(--surface-glass)',
        cursor: disabled && !selected ? 'not-allowed' : 'pointer',
        opacity: disabled && !selected ? 0.4 : 1,
        textAlign: 'left',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        touchAction: 'manipulation',
      }}
      className={!disabled || selected ? 'glass-card-hover' : ''}
    >
      {/* Indicator */}
      <div
        style={{
          width: 20,
          height: 20,
          flexShrink: 0,
          borderRadius: type === 'radio' ? '50%' : '6px',
          border: selected
            ? '2px solid #7c3aed'
            : '2px solid var(--border-medium)',
          background: selected ? '#7c3aed' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        {selected && <Check size={11} color="white" strokeWidth={3} />}
      </div>

      <span
        style={{
          fontSize: '0.9rem',
          fontWeight: selected ? 500 : 400,
          color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
          lineHeight: 1.4,
          transition: 'color 0.2s',
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}
