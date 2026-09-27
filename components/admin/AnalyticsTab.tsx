'use client';
// components/admin/AnalyticsTab.tsx
// Modernized data visualizations with rounded charts, gradient fills, and custom glass tooltips

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { AdminResponseItem } from '@/lib/admin/types';

interface AnalyticsTabProps {
  responses: AdminResponseItem[];
}

const PALETTE = [
  '#06b6d4', // cyan-500
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
];

interface TooltipPayloadItem {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b0b18]/95 backdrop-blur-2xl border border-cyan-500/40 p-3 rounded-2xl shadow-2xl text-xs min-w-[140px]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
          <p className="font-semibold text-white truncate">{label || payload[0].name}</p>
        </div>
        <p className="text-white/60 font-mono text-[11px]">
          Count: <span className="font-bold text-cyan-300">{payload[0].value}</span> respondents
        </p>
      </div>
    );
  }
  return null;
}

export default function AnalyticsTab({ responses }: AnalyticsTabProps) {
  // 1. Platform Distribution
  const platformData = useMemo(() => {
    const counts: Record<string, number> = {};
    responses.forEach((r) => {
      const platforms = r.answers?.q11?.selected;
      if (Array.isArray(platforms)) {
        platforms.forEach((p) => {
          counts[p] = (counts[p] || 0) + 1;
        });
      } else if (platforms) {
        counts[platforms] = (counts[platforms] || 0) + 1;
      }
    });

    const labels: Record<string, string> = {
      spotify: 'Spotify',
      apple_music: 'Apple Music',
      youtube_music: 'YouTube Music',
      soundcloud: 'SoundCloud',
      amazon_music: 'Amazon Music',
      jiosaavn: 'JioSaavn',
      gaana: 'Gaana',
      other: 'Other',
    };

    return Object.entries(counts)
      .map(([k, count]) => ({
        name: labels[k] || k,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [responses]);

  // 2. Daily Listening Duration
  const listeningHoursData = useMemo(() => {
    const counts: Record<string, number> = {
      '< 30 mins': 0,
      '30m - 1hr': 0,
      '1 - 2 hours': 0,
      '2 - 4 hours': 0,
      '4+ hours': 0,
      'Varies a lot': 0,
    };

    const mapKeys: Record<string, string> = {
      less_30min: '< 30 mins',
      '30min_1hr': '30m - 1hr',
      '1_2hr': '1 - 2 hours',
      '2_4hr': '2 - 4 hours',
      '4hr_plus': '4+ hours',
      varies: 'Varies a lot',
    };

    responses.forEach((r) => {
      const q2 = r.answers?.q2?.selected as string;
      const label = mapKeys[q2];
      if (label && counts[label] !== undefined) {
        counts[label]++;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [responses]);

  // 3. Discovery Channels
  const discoveryData = useMemo(() => {
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {
      spotify: 'Spotify',
      youtube: 'YouTube',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      friends: 'Friends / Family',
      playlists: 'Playlists',
      concerts: 'Concerts',
      radio: 'Radio',
      soundcloud: 'SoundCloud',
    };

    responses.forEach((r) => {
      const q7 = r.answers?.q7?.selected;
      if (Array.isArray(q7)) {
        q7.forEach((item) => {
          const l = labels[item] || item;
          counts[l] = (counts[l] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [responses]);

  // 4. Frustrations with Current Apps
  const frustrationsData = useMemo(() => {
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {
      repetitive_recs: 'Repetitive Recommendations',
      inaccurate_recs: 'Inaccurate to Mood',
      hard_to_discover: 'Hard to Discover New Music',
      too_many_features: 'UI Clutter & Podcasts',
      cant_find_mood: "Can't Find For Mood",
      cant_find_activity: "Can't Find For Activity",
      doesnt_understand: "Doesn't Understand Taste",
      not_enough_control: 'Lack of Control',
    };

    responses.forEach((r) => {
      const q13 = r.answers?.q13?.selected;
      if (Array.isArray(q13)) {
        q13.forEach((item) => {
          const l = labels[item] || item;
          counts[l] = (counts[l] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [responses]);

  // 5. Future Experience Desires (Q21)
  const futureWishlistData = useMemo(() => {
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {
      better_mood: 'Mood Matching',
      better_discovery: 'Deep Discovery',
      better_recs: 'Better Recommendations',
      more_control: 'More Listener Control',
      more_personal: 'Deeper Personalization',
      less_effort: 'Less Manual Effort',
      different: 'Novel Concepts',
    };

    responses.forEach((r) => {
      const q21 = r.answers?.q21?.selected;
      if (Array.isArray(q21)) {
        q21.forEach((item) => {
          const l = labels[item] || item;
          counts[l] = (counts[l] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [responses]);

  // 6. Age Demographics
  const ageData = useMemo(() => {
    const counts: Record<string, number> = {
      'Under 18': 0,
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55+': 0,
    };
    responses.forEach((r) => {
      if (counts[r.age_range] !== undefined) {
        counts[r.age_range]++;
      } else {
        counts[r.age_range] = (counts[r.age_range] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [responses]);

  return (
    <div className="w-full space-y-6">
      {/* Row 1: Platforms & Frustrations */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Share */}
        <div className="p-6 rounded-3xl bg-[#0b0b18]/85 border border-white/10 hover:border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Current Streaming Platforms</span>
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Active services participants use for audio consumption
              </p>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-500/10">
              Q11 Multi-Select
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} layout="vertical" margin={{ left: 10, right: 25, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="barGradientCyan" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <XAxis type="number" stroke="#ffffff30" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#ffffff80" fontSize={11} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#barGradientCyan)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Frustrations */}
        <div className="p-6 rounded-3xl bg-[#0b0b18]/85 border border-white/10 hover:border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Primary App Frustrations
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Biggest pain points reported by listeners
              </p>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold shadow-sm shadow-rose-500/10">
              Q13 Pain Points
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frustrationsData} layout="vertical" margin={{ left: 10, right: 25, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="barGradientRose" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <XAxis type="number" stroke="#ffffff30" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#ffffff80" fontSize={11} width={165} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#barGradientRose)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Discovery Sources & Age Demographics */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discovery Sources */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0b0b18]/85 border border-white/10 hover:border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Music Discovery Channels
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Where participants actually discover tracks they enjoy
              </p>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 font-semibold shadow-sm shadow-violet-500/10">
              Q7 Discovery
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={discoveryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradientViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={11} />
                <YAxis stroke="#ffffff30" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#barGradientViolet)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Demographics */}
        <div className="p-6 rounded-3xl bg-[#0b0b18]/85 border border-white/10 hover:border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white tracking-tight">
                Age Distribution
              </h2>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 font-medium">
                Cohorts
              </span>
            </div>
            <p className="text-xs text-white/50 mb-3">
              Participant demographic breakdown
            </p>
          </div>

          <div className="h-48 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ageData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} stroke="rgba(0,0,0,0.4)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-3 pt-3 border-t border-white/[0.06]">
            {ageData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-white/70 px-2 py-0.5 rounded-md bg-white/[0.03]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                />
                <span className="font-mono">{item.name}</span>
                <span className="text-white/40">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Future Wishlist & Daily Consumption */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desired Improvements */}
        <div className="p-6 rounded-3xl bg-[#0b0b18]/85 border border-white/10 hover:border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Desired Future Features
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                What listeners want from upcoming music experiences
              </p>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm shadow-emerald-500/10">
              Q21 Wishlist
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={futureWishlistData} layout="vertical" margin={{ left: 10, right: 25, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="barGradientEmerald" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <XAxis type="number" stroke="#ffffff30" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#ffffff80" fontSize={11} width={160} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#barGradientEmerald)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Listening Duration */}
        <div className="p-6 rounded-3xl bg-[#0b0b18]/85 border border-white/10 hover:border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Daily Listening Time
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Hours spent listening to music per day
              </p>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-sm shadow-amber-500/10">
              Q2 Consumption
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={listeningHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradientAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={11} />
                <YAxis stroke="#ffffff30" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#barGradientAmber)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
