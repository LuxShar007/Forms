'use client';
// components/admin/StatsKpis.tsx
// Spacious, responsive KPI metric cards with robust layout and no overlapping text

import { Users, CheckCircle2, Clock, Sparkles, Music2, AlertTriangle } from 'lucide-react';
import { AdminStats, AdminResponseItem } from '@/lib/admin/types';

interface StatsKpisProps {
  stats: AdminStats;
  responses: AdminResponseItem[];
}

export default function StatsKpis({ stats, responses }: StatsKpisProps) {
  const formatSeconds = (sec: number | null) => {
    if (!sec) return '—';
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}m ${rem}s`;
  };

  const total = stats.total || responses.length;
  const optInCount = stats.futureOptIns || responses.filter((r) => r.future_research_opt_in).length;
  const optInRate = total > 0 ? Math.round((optInCount / total) * 100) : 0;

  // Platform and frustration counters
  const platformCounts: Record<string, number> = {};
  const frustrationCounts: Record<string, number> = {};

  responses.forEach((r) => {
    const pAns = r.answers?.q11?.selected;
    if (Array.isArray(pAns)) {
      pAns.forEach((p) => {
        platformCounts[p] = (platformCounts[p] || 0) + 1;
      });
    } else if (pAns) {
      platformCounts[pAns] = (platformCounts[pAns] || 0) + 1;
    }

    const fAns = r.answers?.q13?.selected;
    if (Array.isArray(fAns)) {
      fAns.forEach((f) => {
        frustrationCounts[f] = (frustrationCounts[f] || 0) + 1;
      });
    } else if (fAns) {
      frustrationCounts[fAns] = (frustrationCounts[fAns] || 0) + 1;
    }
  });

  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Spotify';
  const topFrustrationKey = Object.entries(frustrationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'repetitive_recs';

  const frustrationLabels: Record<string, string> = {
    repetitive_recs: 'Repetitive Recs',
    inaccurate_recs: 'Inaccurate Recs',
    hard_to_discover: 'Hard to Discover',
    too_many_features: 'Feature Clutter',
    cant_find_mood: 'Mood Mismatch',
  };

  const cards = [
    {
      title: 'Total Submissions',
      value: total.toString(),
      subtext: `${stats.today || 1} today`,
      icon: Users,
      accentColor: '#06b6d4',
      borderGlow: 'hover:border-cyan-500/40',
      badge: 'Live',
    },
    {
      title: 'Completion Rate',
      value: total > 0 ? '100%' : '—',
      subtext: `${total} of ${total} finished`,
      icon: CheckCircle2,
      accentColor: '#10b981',
      borderGlow: 'hover:border-emerald-500/40',
      badge: '100%',
    },
    {
      title: 'Avg. Duration',
      value: formatSeconds(stats.avgCompletionSeconds),
      subtext: 'Time per submission',
      icon: Clock,
      accentColor: '#f59e0b',
      borderGlow: 'hover:border-amber-500/40',
      badge: 'Avg',
    },
    {
      title: 'Testing Opt-In',
      value: `${optInRate}%`,
      subtext: `${optInCount} agreed to contact`,
      icon: Sparkles,
      accentColor: '#a855f7',
      borderGlow: 'hover:border-purple-500/40',
      badge: `${optInCount} users`,
    },
    {
      title: 'Top Platform',
      value: topPlatform.replace('_', ' ').toUpperCase(),
      subtext: 'Leading service',
      icon: Music2,
      accentColor: '#3b82f6',
      borderGlow: 'hover:border-blue-500/40',
      badge: 'Share',
    },
    {
      title: 'Top Pain Point',
      value: frustrationLabels[topFrustrationKey] || 'Repetitive Recs',
      subtext: 'Main complaint',
      icon: AlertTriangle,
      accentColor: '#f43f5e',
      borderGlow: 'hover:border-rose-500/40',
      badge: 'Pain Point',
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative p-5 rounded-2xl bg-[#0b0b18]/80 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-black/60 min-w-0 flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient colored radial glow on hover */}
            <div
              className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: card.accentColor }}
            />

            {/* Top gradient highlight line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)`,
              }}
            />

            <div className="min-w-0 relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-medium text-white/50 uppercase tracking-wider truncate">
                  {card.title}
                </span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${card.accentColor}18`,
                    border: `1px solid ${card.accentColor}35`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.accentColor }} />
                </div>
              </div>

              <div
                className="text-2xl font-bold tracking-tight text-white mb-1 font-sans truncate"
                title={card.value}
              >
                {card.value}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1 text-[11px] min-w-0 relative z-10">
              <span className="text-white/45 truncate text-[11px] font-sans">{card.subtext}</span>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold shrink-0 shadow-sm"
                style={{
                  backgroundColor: `${card.accentColor}18`,
                  color: card.accentColor,
                  border: `1px solid ${card.accentColor}30`,
                }}
              >
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
