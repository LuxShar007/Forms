'use client';
// components/admin/ResponsesTableTab.tsx
// Modern table view of survey responses with live searching, filtering, and dossier inspection

import { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight, CheckCircle2, XCircle, Clock, X, RotateCcw, LayoutGrid, List, User, Music2 } from 'lucide-react';
import { AdminResponseItem, FilterState } from '@/lib/admin/types';

interface ResponsesTableTabProps {
  responses: AdminResponseItem[];
  onSelectResponse: (response: AdminResponseItem) => void;
}

export default function ResponsesTableTab({
  responses,
  onSelectResponse,
}: ResponsesTableTabProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    age: '',
    platform: '',
    optInOnly: false,
    sortBy: 'newest',
  });

  const hasActiveFilters = Boolean(
    filters.search || filters.age || filters.platform || filters.optInOnly || filters.sortBy !== 'newest'
  );

  const resetFilters = () => {
    setFilters({
      search: '',
      age: '',
      platform: '',
      optInOnly: false,
      sortBy: 'newest',
    });
  };

  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      // Search text
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = r.name?.toLowerCase().includes(query);
        const matchesEmail = r.email?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      // Age filter
      if (filters.age && r.age_range !== filters.age) {
        return false;
      }

      // Opt-in filter
      if (filters.optInOnly && !r.future_research_opt_in) {
        return false;
      }

      // Platform filter
      if (filters.platform) {
        const platforms = r.answers?.q11?.selected;
        if (Array.isArray(platforms)) {
          if (!platforms.includes(filters.platform)) return false;
        } else if (platforms !== filters.platform) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'oldest') {
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      }
      if (filters.sortBy === 'duration_desc') {
        return (b.completion_time_seconds ?? 0) - (a.completion_time_seconds ?? 0);
      }
      if (filters.sortBy === 'duration_asc') {
        return (a.completion_time_seconds ?? 0) - (b.completion_time_seconds ?? 0);
      }
      // default: newest
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });
  }, [responses, filters]);

  const formatSeconds = (sec: number | null) => {
    if (!sec) return '—';
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}m ${rem}s`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPrimaryPlatform = (r: AdminResponseItem) => {
    const p = r.answers?.q11?.selected;
    if (Array.isArray(p) && p.length > 0) return p[0].replace('_', ' ');
    if (typeof p === 'string') return p.replace('_', ' ');
    return 'Not specified';
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls Bar */}
      <div className="w-full p-4 rounded-2xl bg-[#0e0e1e]/80 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xl shadow-black/20">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search by participant name or email..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Age */}
          <select
            value={filters.age}
            onChange={(e) => setFilters((prev) => ({ ...prev, age: e.target.value }))}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs focus:outline-none focus:border-cyan-400/50 cursor-pointer"
          >
            <option value="" className="bg-[#181830] text-white">All Ages</option>
            <option value="18-24" className="bg-[#181830] text-white">18-24</option>
            <option value="25-34" className="bg-[#181830] text-white">25-34</option>
            <option value="35-44" className="bg-[#181830] text-white">35-44</option>
            <option value="45-54" className="bg-[#181830] text-white">45-54</option>
            <option value="55+" className="bg-[#181830] text-white">55+</option>
          </select>

          {/* Platform */}
          <select
            value={filters.platform}
            onChange={(e) => setFilters((prev) => ({ ...prev, platform: e.target.value }))}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs focus:outline-none focus:border-cyan-400/50 cursor-pointer"
          >
            <option value="" className="bg-[#181830] text-white">All Platforms</option>
            <option value="spotify" className="bg-[#181830] text-white">Spotify</option>
            <option value="apple_music" className="bg-[#181830] text-white">Apple Music</option>
            <option value="youtube_music" className="bg-[#181830] text-white">YouTube Music</option>
            <option value="soundcloud" className="bg-[#181830] text-white">SoundCloud</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))
            }
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs focus:outline-none focus:border-cyan-400/50 cursor-pointer"
          >
            <option value="newest" className="bg-[#181830] text-white">Newest First</option>
            <option value="oldest" className="bg-[#181830] text-white">Oldest First</option>
            <option value="duration_desc" className="bg-[#181830] text-white">Longest Time</option>
            <option value="duration_asc" className="bg-[#181830] text-white">Shortest Time</option>
          </select>

          {/* Opt-in toggle */}
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, optInOnly: !prev.optInOnly }))}
            className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              filters.optInOnly
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-sm shadow-purple-500/10'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            Opt-In Only
          </button>
        </div>

        {/* Controls Bar Right: View mode and reset */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40 shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Dossier Cards View"
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40 shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Cards or Table */}
      {filteredResponses.length === 0 ? (
        <div className="w-full py-16 text-center rounded-3xl bg-[#0b0b18]/80 border border-white/10 backdrop-blur-2xl">
          <p className="text-base font-semibold text-white/70 mb-1">No responses match your search</p>
          <p className="text-xs text-white/40 mb-4">Try adjusting your filters or search keywords</p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Executive Dossier Card Grid */
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredResponses.map((r) => {
            const initials = r.name
              ? r.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'P';

            const quoteSnippet =
              r.answers?.q20?.text ||
              r.answers?.q13?.text ||
              r.answers?.q1?.text ||
              'No written reflection provided.';

            return (
              <div
                key={r.id}
                onClick={() => onSelectResponse(r)}
                className="p-6 rounded-3xl bg-[#0b0b18]/85 border border-white/10 hover:border-purple-500/40 backdrop-blur-2xl shadow-2xl shadow-black/40 hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top ambient highlight line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Participant Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500/30 to-cyan-500/30 border border-white/15 flex items-center justify-center font-mono font-bold text-white text-sm shadow-md group-hover:scale-105 transition-transform">
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {r.name || 'Anonymous Participant'}
                        </h3>
                        <p className="text-xs text-white/40 font-mono truncate max-w-[180px]">
                          {r.email}
                        </p>
                      </div>
                    </div>

                    {r.future_research_opt_in ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Opted In</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-white/35 text-[10px] font-mono">
                        <span>No Opt-in</span>
                      </span>
                    )}
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-[11px] text-white/70">
                      Cohort: {r.age_range || 'N/A'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 font-mono text-[11px] text-cyan-300 capitalize flex items-center gap-1.5">
                      <Music2 className="w-3 h-3 text-cyan-400" />
                      <span>{getPrimaryPlatform(r)}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-[11px] text-white/60 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span>{formatSeconds(r.completion_time_seconds)}</span>
                    </span>
                  </div>

                  {/* Qualitative Snippet Preview */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 mb-4">
                    <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-1">
                      Participant Thought
                    </p>
                    <p className="text-xs text-white/80 line-clamp-2 italic font-sans">
                      "{quoteSnippet}"
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-white/40">
                    {formatDate(r.submitted_at)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
                    <span>Inspect Dossier</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Executive Table View */
        <div className="w-full rounded-3xl bg-[#0b0b18]/85 border border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs text-white/80">
              <thead className="bg-white/[0.03] border-b border-white/10 uppercase tracking-wider font-mono text-[10px] text-white/45">
                <tr>
                  <th className="py-4 px-6">Participant</th>
                  <th className="py-4 px-4">Age Cohort</th>
                  <th className="py-4 px-4">Primary Platform</th>
                  <th className="py-4 px-4">Duration</th>
                  <th className="py-4 px-4">Research Opt-In</th>
                  <th className="py-4 px-4">Submitted</th>
                  <th className="py-4 px-6 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredResponses.map((r) => {
                  const initials = r.name
                    ? r.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'P';

                  return (
                    <tr
                      key={r.id}
                      onClick={() => onSelectResponse(r)}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/25 to-purple-500/25 border border-white/10 flex items-center justify-center font-mono font-bold text-white text-xs shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                              {r.name || 'Anonymous Participant'}
                            </div>
                            <div className="text-[11px] text-white/40 font-mono">
                              {r.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Age */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[11px] text-white/70">
                          {r.age_range || 'N/A'}
                        </span>
                      </td>

                      {/* Primary Platform */}
                      <td className="py-4 px-4">
                        <span className="capitalize font-mono text-[11px] text-white/90 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5">
                          {getPrimaryPlatform(r)}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-white/70 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-white/40" />
                          <span>{formatSeconds(r.completion_time_seconds)}</span>
                        </div>
                      </td>

                      {/* Beta Opt-In */}
                      <td className="py-4 px-4">
                        {r.future_research_opt_in ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Opted In</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-white/35 text-[10px] font-mono">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>

                      {/* Submitted Date */}
                      <td className="py-4 px-4 text-white/50 font-mono text-[11px]">
                        {formatDate(r.submitted_at)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/15 group-hover:bg-purple-500/25 border border-purple-400/30 text-purple-200 text-xs font-semibold transition-all shadow-sm">
                          <span>View Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="py-3.5 px-6 border-t border-white/[0.06] bg-white/[0.015] flex items-center justify-between text-xs text-white/45 font-mono">
            <span>Showing {filteredResponses.length} of {responses.length} responses</span>
            <span>Click any row or card to open the complete questionnaire dossier</span>
          </div>
        </div>
      )}
    </div>
  );
}
