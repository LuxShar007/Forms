'use client';
// components/admin/QualitativeTab.tsx
// Explorer for participant open-ended quotes and qualitative reflections

import { useState, useMemo } from 'react';
import { Search, Copy, Check, Quote, X } from 'lucide-react';
import { AdminResponseItem } from '@/lib/admin/types';

interface QualitativeTabProps {
  responses: AdminResponseItem[];
  onSelectResponse: (response: AdminResponseItem) => void;
}

interface QuoteItem {
  responseId: string;
  participantName: string;
  age: string;
  platform: string;
  questionId: string;
  questionTitle: string;
  quoteText: string;
  fullResponse: AdminResponseItem;
}

const QUESTION_LABELS: Record<string, string> = {
  q20: "What today's apps don't understand about you",
  q13: 'Frustrating experiences with current music platforms',
  q1: 'Why music is important to you',
  q6: 'Deep reasons for listening to music',
  q16: 'Musical memories & emotional connections',
  q21: 'What would make a new music experience exciting',
  q22: 'What would make you try a new music experience',
};

export default function QualitativeTab({
  responses,
  onSelectResponse,
}: QualitativeTabProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all quotes from responses
  const quotes: QuoteItem[] = useMemo(() => {
    const list: QuoteItem[] = [];

    responses.forEach((r) => {
      const answers = r.answers || {};
      const platformRaw = answers.q11?.selected;
      const platform = Array.isArray(platformRaw) ? platformRaw[0] : (platformRaw || 'Spotify');

      Object.entries(QUESTION_LABELS).forEach(([qid, title]) => {
        const text = answers[qid]?.text;
        if (text && text.trim().length > 0) {
          list.push({
            responseId: r.id,
            participantName: r.name || 'Anonymous',
            age: r.age_range,
            platform: platform.replace('_', ' '),
            questionId: qid,
            questionTitle: title,
            quoteText: text.trim(),
            fullResponse: r,
          });
        }
      });
    });

    return list;
  }, [responses]);

  // Filter quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((item) => {
      if (selectedQuestion !== 'all' && item.questionId !== selectedQuestion) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          item.quoteText.toLowerCase().includes(q) ||
          item.participantName.toLowerCase().includes(q) ||
          item.questionTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [quotes, selectedQuestion, search]);

  const handleCopy = (quote: QuoteItem, idx: number) => {
    const textToCopy = `"${quote.quoteText}" — ${quote.participantName} (${quote.age}, ${quote.platform})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(`${quote.responseId}-${idx}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Filter and Search header */}
      <div className="w-full p-4 rounded-2xl bg-[#0e0e1e]/80 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xl shadow-black/20">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participant quotes, keywords, themes..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-cyan-400/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Question filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs focus:outline-none focus:border-cyan-400/50 max-w-xs truncate cursor-pointer"
          >
            <option value="all" className="bg-[#181830] text-white">All Qualitative Questions ({quotes.length})</option>
            {Object.entries(QUESTION_LABELS).map(([qid, label]) => (
              <option key={qid} value={qid} className="bg-[#181830] text-white">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotes Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="p-14 text-center rounded-2xl bg-[#0e0e1e]/60 border border-white/10 text-white/40 text-xs font-mono">
          No participant reflections match this search.
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuotes.map((quote, idx) => {
            const key = `${quote.responseId}-${idx}`;
            const isCopied = copiedId === key;

            return (
              <div
                key={key}
                className="p-7 min-h-[250px] rounded-3xl bg-[#0b0b18]/85 border border-white/10 hover:border-cyan-500/40 backdrop-blur-2xl shadow-2xl shadow-black/40 hover:shadow-cyan-500/10 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Top ambient highlight line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />

                {/* Background watermark quote icon */}
                <Quote className="absolute -right-4 -top-4 w-28 h-28 text-white/[0.025] pointer-events-none group-hover:text-cyan-400/[0.04] transition-colors" />

                <div>
                  {/* Topic badge & copy action */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 truncate max-w-[85%] font-semibold shadow-sm shadow-cyan-500/10">
                      {quote.questionTitle}
                    </span>
                    <button
                      onClick={() => handleCopy(quote, idx)}
                      title="Copy Quote"
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition-all cursor-pointer border border-white/5"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* The Quote */}
                  <div className="relative pl-4 mb-6 border-l-2 border-cyan-400/70">
                    <p className="text-base text-white/95 leading-relaxed font-sans italic font-normal">
                      "{quote.quoteText}"
                    </p>
                  </div>
                </div>

                {/* Attribution and View Full Dossier */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/30 via-indigo-500/30 to-purple-500/30 border border-white/15 flex items-center justify-center text-xs font-mono text-white font-bold shrink-0 shadow-sm">
                      {quote.participantName[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {quote.participantName}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono capitalize">
                        {quote.age} • {quote.platform} listener
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectResponse(quote.fullResponse)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 hover:text-cyan-200 text-xs font-semibold font-mono transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
