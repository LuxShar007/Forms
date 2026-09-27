'use client';
// components/admin/ResponsesTableTab.tsx
// Spacious, elegant research participant table with rich filters & Apple/Linear aesthetic

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, RotateCcw, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { AdminResponseItem } from '@/lib/admin/types';
import { SURVEY_QUESTIONS } from '@/lib/survey/questions';

interface ResponsesTableTabProps {
  responses: AdminResponseItem[];
  onSelectResponse?: (response: AdminResponseItem) => void;
}

export default function ResponsesTableTab({ responses }: ResponsesTableTabProps) {
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('');
  const [motivationFilter, setMotivationFilter] = useState('');
  const [discoveryFilter, setDiscoveryFilter] = useState('');
  const [frustrationFilter, setFrustrationFilter] = useState('');
  const [optInFilter, setOptInFilter] = useState<'all' | 'opted_in' | 'declined'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Question option lookup map for human-readable labels
  const optionLabels = useMemo(() => {
    const map: Record<string, string> = {};
    SURVEY_QUESTIONS.forEach((q) => {
      if (q.options) {
        q.options.forEach((opt) => {
          map[opt.value] = opt.label;
        });
      }
    });
    return map;
  }, []);

  const hasActiveFilters = Boolean(
    search ||
    ageFilter ||
    platformFilter ||
    frequencyFilter ||
    motivationFilter ||
    discoveryFilter ||
    frustrationFilter ||
    optInFilter !== 'all' ||
    sortOrder !== 'newest'
  );

  const resetFilters = () => {
    setSearch('');
    setAgeFilter('');
    setPlatformFilter('');
    setFrequencyFilter('');
    setMotivationFilter('');
    setDiscoveryFilter('');
    setFrustrationFilter('');
    setOptInFilter('all');
    setSortOrder('newest');
  };

  // Helper getters
  const getPrimaryPlatform = (r: AdminResponseItem): string => {
    const p = r.answers?.q11?.selected;
    if (Array.isArray(p) && p.length > 0) {
      return optionLabels[p[0]] || p[0].replace(/_/g, ' ');
    }
    if (typeof p === 'string' && p) {
      return optionLabels[p] || p.replace(/_/g, ' ');
    }
    return '—';
  };

  const getPrimaryMotivation = (r: AdminResponseItem): string => {
    const m = r.answers?.q6?.selected;
    if (Array.isArray(m) && m.length > 0) {
      return optionLabels[m[0]] || m[0].replace(/_/g, ' ');
    }
    if (typeof m === 'string' && m) {
      return optionLabels[m] || m.replace(/_/g, ' ');
    }
    return '—';
  };

  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      // Search by name or email
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = r.name?.toLowerCase().includes(query);
        const matchesEmail = r.email?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      // Age filter
      if (ageFilter && r.age_range !== ageFilter) {
        return false;
      }

      // Future research opt-in
      if (optInFilter === 'opted_in' && !r.future_research_opt_in) return false;
      if (optInFilter === 'declined' && r.future_research_opt_in) return false;

      // Platform filter (q11)
      if (platformFilter) {
        const pAns = r.answers?.q11?.selected;
        const list = Array.isArray(pAns) ? pAns : pAns ? [pAns] : [];
        if (!list.includes(platformFilter)) return false;
      }

      // Listening frequency filter (q2)
      if (frequencyFilter) {
        const freqAns = r.answers?.q2?.selected;
        if (freqAns !== frequencyFilter) return false;
      }

      // Motivation filter (q6)
      if (motivationFilter) {
        const mAns = r.answers?.q6?.selected;
        const list = Array.isArray(mAns) ? mAns : mAns ? [mAns] : [];
        if (!list.includes(motivationFilter)) return false;
      }

      // Discovery source filter (q7)
      if (discoveryFilter) {
        const dAns = r.answers?.q7?.selected;
        const list = Array.isArray(dAns) ? dAns : dAns ? [dAns] : [];
        if (!list.includes(discoveryFilter)) return false;
      }

      // Frustration filter (q13)
      if (frustrationFilter) {
        const fAns = r.answers?.q13?.selected;
        const list = Array.isArray(fAns) ? fAns : fAns ? [fAns] : [];
        if (!list.includes(frustrationFilter)) return false;
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.submitted_at || 0).getTime();
      const timeB = new Date(b.submitted_at || 0).getTime();
      return sortOrder === 'oldest' ? timeA - timeB : timeB - timeA;
    });
  }, [
    responses,
    search,
    ageFilter,
    platformFilter,
    frequencyFilter,
    motivationFilter,
    discoveryFilter,
    frustrationFilter,
    optInFilter,
    sortOrder,
  ]);

  const handleRowClick = (id: string) => {
    router.push(`/responses/${id}`);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">Responses</h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Individual participant dossiers and verified questionnaire submissions
          </p>
        </div>
        <div className="text-xs text-[#8E8E93]">
          Showing <span className="font-semibold text-[#EDEDEF]">{filteredResponses.length}</span> of {responses.length} responses
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="p-4 rounded-xl bg-[#101014] border border-white/[0.06] mb-6 flex flex-col gap-3">
        {/* Top search & quick actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] placeholder-[#8E8E93] focus:outline-none focus:border-white/[0.2] transition duration-150"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-[#8E8E93] hover:text-[#EDEDEF] font-medium flex items-center gap-1.5 transition duration-150 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-white/[0.04]">
          {/* Age Filter */}
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] focus:outline-none cursor-pointer truncate"
          >
            <option value="">All Ages</option>
            <option value="Under 16">Under 16</option>
            <option value="16–17">16–17</option>
            <option value="18–20">18–20</option>
            <option value="21–24">21–24</option>
            <option value="25–29">25–29</option>
            <option value="30–39">30–39</option>
            <option value="40–49">40–49</option>
            <option value="50+">50+</option>
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] focus:outline-none cursor-pointer truncate"
          >
            <option value="">All Platforms</option>
            <option value="spotify">Spotify</option>
            <option value="youtube_music">YouTube Music</option>
            <option value="apple_music">Apple Music</option>
            <option value="soundcloud">SoundCloud</option>
            <option value="amazon_music">Amazon Music</option>
            <option value="jiosaavn">JioSaavn</option>
          </select>

          {/* Listening Frequency */}
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] focus:outline-none cursor-pointer truncate"
          >
            <option value="">All Listening Time</option>
            <option value="less_30min">Less than 30m</option>
            <option value="30min_1hr">30m – 1hr</option>
            <option value="1_2hr">1–2 hours</option>
            <option value="2_4hr">2–4 hours</option>
            <option value="4hr_plus">4+ hours</option>
            <option value="varies">Varies a lot</option>
          </select>

          {/* Primary Motivation */}
          <select
            value={motivationFilter}
            onChange={(e) => setMotivationFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] focus:outline-none cursor-pointer truncate"
          >
            <option value="">All Motivations</option>
            <option value="relax">Relax</option>
            <option value="improve_mood">Improve mood</option>
            <option value="focus">Focus</option>
            <option value="study">Study</option>
            <option value="get_energized">Energize</option>
            <option value="escape">Escape</option>
            <option value="discover_new">Discovery</option>
          </select>

          {/* Discovery Source */}
          <select
            value={discoveryFilter}
            onChange={(e) => setDiscoveryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] focus:outline-none cursor-pointer truncate"
          >
            <option value="">All Discovery</option>
            <option value="spotify">Spotify</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="friends">Friends</option>
            <option value="playlists">Playlists</option>
          </select>

          {/* Frustration */}
          <select
            value={frustrationFilter}
            onChange={(e) => setFrustrationFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] focus:outline-none cursor-pointer truncate"
          >
            <option value="">All Frustrations</option>
            <option value="repetitive_recs">Repetitive</option>
            <option value="inaccurate_recs">Inaccurate</option>
            <option value="cant_find_mood">Mood mismatch</option>
            <option value="hard_to_discover">Hard discovery</option>
            <option value="too_many_features">Feature clutter</option>
          </select>

          {/* Future research opt-in */}
          <select
            value={optInFilter}
            onChange={(e) => setOptInFilter(e.target.value as 'all' | 'opted_in' | 'declined')}
            className="px-2.5 py-1.5 rounded-lg bg-[#15151B] border border-white/[0.06] text-xs text-[#EDEDEF] focus:outline-none cursor-pointer truncate"
          >
            <option value="all">Opt-In: All</option>
            <option value="opted_in">Opted in</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      {filteredResponses.length === 0 ? (
        <div className="w-full py-16 px-6 rounded-xl bg-[#101014] border border-white/[0.06] text-center my-6">
          <h3 className="text-base font-medium text-[#EDEDEF] mb-1">No matching responses</h3>
          <p className="text-xs text-[#8E8E93] max-w-md mx-auto mb-4">
            Try adjusting your search query or resetting filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-3.5 py-1.5 rounded-lg bg-[#15151B] hover:bg-[#1C1C24] border border-white/[0.06] text-xs font-medium text-[#EDEDEF] cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-[#101014] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#101014] text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider">
                  <th className="py-3 px-5">Participant</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-5">Primary platform</th>
                  <th className="py-3 px-5">Primary motivation</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-5 text-right">Future research</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredResponses.map((r) => {
                  return (
                    <tr
                      key={r.id}
                      onClick={() => handleRowClick(r.id)}
                      className="group hover:bg-[#15151B] transition-colors duration-150 cursor-pointer"
                    >
                      {/* Participant */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#15151B] group-hover:bg-[#1C1C24] border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-[#EDEDEF] shrink-0">
                            {r.name?.slice(0, 1).toUpperCase() || 'P'}
                          </div>
                          <span className="text-sm font-medium text-[#EDEDEF] group-hover:text-white truncate">
                            {r.name || 'Anonymous'}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5 text-xs text-[#8E8E93] font-mono truncate max-w-[200px]">
                        {r.email || '—'}
                      </td>

                      {/* Age */}
                      <td className="py-3.5 px-4 text-xs text-[#8E8E93] whitespace-nowrap">
                        {r.age_range || '—'}
                      </td>

                      {/* Primary Platform */}
                      <td className="py-3.5 px-5 text-xs text-[#EDEDEF] whitespace-nowrap">
                        {getPrimaryPlatform(r)}
                      </td>

                      {/* Primary Motivation */}
                      <td className="py-3.5 px-5 text-xs text-[#8E8E93] whitespace-nowrap">
                        {getPrimaryMotivation(r)}
                      </td>

                      {/* Submitted */}
                      <td className="py-3.5 px-4 text-xs text-[#8E8E93] whitespace-nowrap">
                        {formatDate(r.submitted_at)}
                      </td>

                      {/* Future Research */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        {r.future_research_opt_in ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Opted In
                          </span>
                        ) : (
                          <span className="text-xs text-[#8E8E93]/60">No</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-white/[0.04]">
            {filteredResponses.map((r) => (
              <div
                key={r.id}
                onClick={() => handleRowClick(r.id)}
                className="p-4 active:bg-[#15151B] transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[#EDEDEF] truncate">
                      {r.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-[#8E8E93]">· {r.age_range}</span>
                  </div>
                  <p className="text-xs text-[#8E8E93] truncate mb-2">{r.email}</p>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-[#8E8E93]">
                    <span className="px-2 py-0.5 rounded bg-[#15151B] border border-white/[0.06] text-[#EDEDEF]">
                      {getPrimaryPlatform(r)}
                    </span>
                    <span>·</span>
                    <span>{getPrimaryMotivation(r)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {r.future_research_opt_in ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Opted In
                    </span>
                  ) : (
                    <span className="text-xs text-[#8E8E93]/50">No</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
