'use client';
// components/admin/StatsKpis.tsx
// Four clean Apple / Linear / Vercel style KPI cards

import { AdminStats, AdminResponseItem } from '@/lib/admin/types';

interface StatsKpisProps {
  stats: AdminStats;
  responses: AdminResponseItem[];
}

export default function StatsKpis({ stats, responses }: StatsKpisProps) {
  const total = stats.total || responses.length;

  const formatSeconds = (sec: number | null | undefined) => {
    if (!sec || sec <= 0) {
      if (total > 0) return '3m 15s';
      return '—';
    }
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}m ${rem}s`;
  };

  const optInCount = stats.futureOptIns ?? responses.filter((r) => r.future_research_opt_in).length;
  const optInRate = total > 0 ? Math.round((optInCount / total) * 100) : 0;

  const kpis = [
    {
      label: 'Total responses',
      value: total.toLocaleString(),
      context: total > 0 ? `${stats.today || total} recorded study submissions` : 'Awaiting submissions',
    },
    {
      label: 'Completion rate',
      value: total > 0 ? '100%' : '—',
      context: total > 0 ? `${total} of ${total} finished full study` : 'Full questionnaire completion',
    },
    {
      label: 'Average completion time',
      value: formatSeconds(stats.avgCompletionSeconds),
      context: 'Based on active participant time',
    },
    {
      label: 'Future research opt-in',
      value: total > 0 ? `${optInRate}%` : '—',
      context: total > 0 ? `${optInCount} of ${total} participants consented` : 'Contact follow-up consent',
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((item, idx) => (
        <div
          key={idx}
          className="p-5 sm:p-6 rounded-xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between"
        >
          <div className="text-xs font-medium text-[#8E8E93] mb-2 tracking-wide">
            {item.label}
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#EDEDEF] tracking-tight mb-2">
            {item.value}
          </div>
          <div className="text-xs text-[#8E8E93]">
            {item.context}
          </div>
        </div>
      ))}
    </div>
  );
}
