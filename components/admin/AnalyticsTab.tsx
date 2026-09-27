'use client';
// components/admin/AnalyticsTab.tsx
// Research analytics section with Apple / Linear / Vercel minimal aesthetic

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AdminResponseItem } from '@/lib/admin/types';

interface AnalyticsTabProps {
  responses: AdminResponseItem[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { name: string; count: number; pct: number } }>;
}

function ResearchTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#15151B] border border-white/[0.1] px-3 py-2 rounded-lg shadow-xl text-xs">
        <p className="font-medium text-[#EDEDEF] mb-0.5">{item.name}</p>
        <p className="text-[#8E8E93]">
          <span className="font-semibold text-[#EDEDEF]">{item.count}</span> {item.count === 1 ? 'response' : 'responses'} ({item.pct}%)
        </p>
      </div>
    );
  }
  return null;
}

export default function AnalyticsTab({ responses }: AnalyticsTabProps) {
  const total = responses.length;

  // Chart 1: Why people listen (q6)
  const motivationsData = useMemo(() => {
    if (total === 0) return [];
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {
      relax: 'Relax',
      improve_mood: 'Improve mood',
      maintain_mood: 'Maintain mood',
      focus: 'Focus',
      study: 'Study',
      get_energized: 'Get energized',
      feel_motivated: 'Feel motivated',
      escape: 'Escape from everything',
      remember_moments: 'Remember moments',
      express_myself: 'Express myself',
      feel_connected: 'Feel connected',
      discover_new: 'Discover new music',
      entertainment: 'Entertainment',
      habit: 'Habit',
    };

    responses.forEach((r) => {
      const ans = r.answers?.q6?.selected;
      if (Array.isArray(ans)) {
        ans.forEach((k) => {
          counts[k] = (counts[k] || 0) + 1;
        });
      } else if (typeof ans === 'string') {
        counts[ans] = (counts[ans] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([key, count]) => ({
        name: labels[key] || key.replace(/_/g, ' '),
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [responses, total]);

  // Chart 2: What frustrates listeners (q13)
  const frustrationsData = useMemo(() => {
    if (total === 0) return [];
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {
      repetitive_recs: 'Repetitive recommendations',
      inaccurate_recs: 'Inaccurate recommendations',
      cant_find_mood: 'Cannot match current mood',
      too_much_effort: 'Too much effort to find music',
      hard_to_discover: 'Hard to discover genuinely new music',
      doesnt_understand: "Doesn't understand taste",
      too_many_features: 'Feature overload / clutter',
      not_enough_control: 'Not enough control',
      not_enough_personal: 'Not enough personalization',
      irrelevant_recs: 'Irrelevant recommendations',
    };

    responses.forEach((r) => {
      const ans = r.answers?.q13?.selected;
      if (Array.isArray(ans)) {
        ans.forEach((k) => {
          counts[k] = (counts[k] || 0) + 1;
        });
      } else if (typeof ans === 'string') {
        counts[ans] = (counts[ans] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([key, count]) => ({
        name: labels[key] || key.replace(/_/g, ' '),
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [responses, total]);

  // Chart 3: Music discovery channels (q7)
  const discoveryData = useMemo(() => {
    if (total === 0) return [];
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {
      spotify: 'Spotify algorithms & feeds',
      youtube: 'YouTube / YouTube Music',
      youtube_music: 'YouTube Music',
      apple_music: 'Apple Music',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      friends: 'Friends & Word of mouth',
      family: 'Family',
      playlists: 'Curated playlists',
      artists: 'Direct artist follows',
      movies_tv: 'Movies / TV soundtracks',
      games: 'Video games',
    };

    responses.forEach((r) => {
      const ans = r.answers?.q7?.selected;
      if (Array.isArray(ans)) {
        ans.forEach((k) => {
          counts[k] = (counts[k] || 0) + 1;
        });
      } else if (typeof ans === 'string') {
        counts[ans] = (counts[ans] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([key, count]) => ({
        name: labels[key] || key.replace(/_/g, ' '),
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [responses, total]);

  // Chart 4: Age distribution
  const ageData = useMemo(() => {
    if (total === 0) return [];
    const order = ['Under 16', '16–17', '18–20', '21–24', '25–29', '30–39', '40–49', '50+', 'Prefer not to say'];
    const counts: Record<string, number> = {};

    responses.forEach((r) => {
      const age = r.age_range || 'Unknown';
      counts[age] = (counts[age] || 0) + 1;
    });

    return order
      .filter((age) => counts[age] !== undefined)
      .map((age) => ({
        name: age,
        count: counts[age] || 0,
        pct: Math.round(((counts[age] || 0) / total) * 100),
      }));
  }, [responses, total]);

  // Chart 5: What people want music apps to understand (q17)
  const understandData = useMemo(() => {
    if (total === 0) return [];
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {
      current_mood: 'Current mood',
      activity: 'What I am doing (activity)',
      usual_moods: 'My usual moods over time',
      energy_level: 'Current energy level',
      fav_artists: 'Favorite artists',
      fav_genres: 'Favorite genres',
      time_of_day: 'Time of day context',
      want_more_of: 'Music I want more of',
      tired_of: 'Music I am tired of',
      changing_taste: 'My changing taste over time',
      openness: 'My openness to discovery',
      musical_memories: 'My musical memories',
      language_pref: 'Language preferences',
    };

    responses.forEach((r) => {
      const ans = r.answers?.q17?.selected;
      if (Array.isArray(ans)) {
        ans.forEach((k) => {
          counts[k] = (counts[k] || 0) + 1;
        });
      } else if (typeof ans === 'string') {
        counts[ans] = (counts[ans] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([key, count]) => ({
        name: labels[key] || key.replace(/_/g, ' '),
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [responses, total]);

  // Chart 6: Recommendation control preferences (q18)
  const controlData = useMemo(() => {
    if (total === 0) return [];
    const counts: Record<string, number> = {};
    const labels: Record<string, string> = {
      some_control: 'Give me some control',
      describe_exactly: 'Let me describe exactly what I want',
      mostly_recommend: 'Mostly recommend for me',
      full_control: 'I want full manual control',
      just_give_me: 'Just give me something good',
    };

    responses.forEach((r) => {
      const ans = r.answers?.q18?.selected;
      if (typeof ans === 'string') {
        counts[ans] = (counts[ans] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([key, count]) => ({
        name: labels[key] || key.replace(/_/g, ' '),
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [responses, total]);

  if (total === 0) {
    return (
      <div className="w-full py-16 px-6 rounded-xl bg-[#101014] border border-white/[0.06] text-center my-6">
        <h3 className="text-base font-medium text-[#EDEDEF] mb-1">No responses yet</h3>
        <p className="text-xs text-[#8E8E93] max-w-md mx-auto">
          Once participants complete the study, research insights will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {/* Chart 1: Listening motivations */}
      <div className="p-6 rounded-xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#EDEDEF]">Listening motivations</h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">Primary reasons and emotional drivers for listening</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={motivationsData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ResearchTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Listener frustrations */}
      <div className="p-6 rounded-xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#EDEDEF]">Listener frustrations</h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">Key issues encountered with existing music platforms</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={frustrationsData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ResearchTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Music discovery */}
      <div className="p-6 rounded-xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#EDEDEF]">Music discovery</h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">Where listeners uncover new songs and artists</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={discoveryData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ResearchTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Age distribution */}
      <div className="p-6 rounded-xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#EDEDEF]">Age distribution</h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">Demographic representation of study participants</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={ageData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ResearchTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 5: What listeners want apps to understand */}
      <div className="p-6 rounded-xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#EDEDEF]">What listeners want apps to understand</h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">Contextual dimensions users wish platforms factored in</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={understandData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ResearchTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 6: Recommendation & control preferences */}
      <div className="p-6 rounded-xl bg-[#101014] border border-white/[0.06] flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#EDEDEF]">Recommendation & control preferences</h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">Desired balance between algorithmic curation and manual control</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={controlData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ResearchTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
