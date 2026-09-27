'use client';
// components/survey/ProgressBar.tsx

interface Props {
  current: number;   // 1-indexed current question
  total: number;
  sectionTitle: string;
  sectionNumber: number;
  totalSections: number;
}

export default function ProgressBar({
  current,
  total,
  sectionTitle,
  sectionNumber,
  totalSections,
}: Props) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#a78bfa',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '2px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Sec {sectionNumber}/{totalSections}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
            {sectionTitle}
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {current} / {total}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '2px',
          background: 'var(--border-subtle)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--cubet-purple), var(--cubet-purple-light))',
            borderRadius: '2px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}
