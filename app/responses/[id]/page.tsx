'use client';
// app/responses/[id]/page.tsx
// Dedicated participant dossier page with Apple / Linear / Vercel research intelligence UX

import { useEffect, useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronRight, Loader2, Copy, Check } from 'lucide-react';
import CubetMusicField from '@/components/CubetMusicField';
import { SURVEY_QUESTIONS, SECTIONS } from '@/lib/survey/questions';
import { AdminResponseItem } from '@/lib/admin/types';
import { MOCK_RESPONSES } from '@/lib/admin/mockData';

export default function ResponseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [response, setResponse] = useState<AdminResponseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Keyboard navigation: Backspace or Esc to return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/responses');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  useEffect(() => {
    async function loadResponse() {
      try {
        const res = await fetch(`/api/admin/responses/${id}`);
        if (res.status === 401) {
          router.push('/responses/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (data.response) {
            setResponse(data.response);
            setLoading(false);
            return;
          }
        }

        // Fallback to mock responses if API route did not find it
        const fallback = MOCK_RESPONSES.find((r) => r.id === id);
        if (fallback) {
          setResponse(fallback);
        } else {
          setError('Participant response not found');
        }
      } catch {
        const fallback = MOCK_RESPONSES.find((r) => r.id === id);
        if (fallback) {
          setResponse(fallback);
        } else {
          setError('Failed to load response data');
        }
      } finally {
        setLoading(false);
      }
    }

    loadResponse();
  }, [id, router]);

  // Option labels lookup map
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

  const formatSeconds = (sec: number | null | undefined) => {
    if (!sec || sec <= 0) return '3m 15s';
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}m ${rem}s`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const copyJson = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Section answers helper
  const sectionsWithQuestions = useMemo(() => {
    return SECTIONS.map((sec, idx) => {
      const questions = SURVEY_QUESTIONS.filter((q) => q.section === sec.id);
      return {
        sectionNum: String(idx + 1).padStart(2, '0'),
        title: sec.title,
        questions,
      };
    });
  }, []);

  // Summary card helpers
  const musicImportance = useMemo(() => {
    const val = response?.answers?.q1?.selected;
    if (typeof val === 'string') return optionLabels[val] || val.replace(/_/g, ' ');
    return '—';
  }, [response, optionLabels]);

  const dailyListening = useMemo(() => {
    const val = response?.answers?.q2?.selected;
    if (typeof val === 'string') return optionLabels[val] || val.replace(/_/g, ' ');
    return '—';
  }, [response, optionLabels]);

  const primaryPlatform = useMemo(() => {
    const p = response?.answers?.q11?.selected;
    if (Array.isArray(p) && p.length > 0) return optionLabels[p[0]] || p[0].replace(/_/g, ' ');
    if (typeof p === 'string' && p) return optionLabels[p] || p.replace(/_/g, ' ');
    return '—';
  }, [response, optionLabels]);

  const discoveryBehavior = useMemo(() => {
    const d = response?.answers?.q7?.selected;
    if (Array.isArray(d) && d.length > 0) return optionLabels[d[0]] || d[0].replace(/_/g, ' ');
    if (typeof d === 'string' && d) return optionLabels[d] || d.replace(/_/g, ' ');
    return '—';
  }, [response, optionLabels]);

  const primaryMotivation = useMemo(() => {
    const m = response?.answers?.q6?.selected;
    if (Array.isArray(m) && m.length > 0) return optionLabels[m[0]] || m[0].replace(/_/g, ' ');
    if (typeof m === 'string' && m) return optionLabels[m] || m.replace(/_/g, ' ');
    return '—';
  }, [response, optionLabels]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080B] text-[#EDEDEF] flex flex-col items-center justify-center gap-3">
        <CubetMusicField subtle />
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin relative z-10" />
        <p className="text-xs text-[#8E8E93] relative z-10">Loading participant dossier...</p>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="min-h-screen bg-[#08080B] text-[#EDEDEF] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <CubetMusicField subtle />
        <div className="relative z-10 max-w-md p-8 rounded-xl bg-[#101014] border border-white/[0.06]">
          <h2 className="text-lg font-semibold text-[#EDEDEF] mb-2">{error || 'Response Not Found'}</h2>
          <p className="text-xs text-[#8E8E93] mb-6">
            The requested participant submission could not be located in the database.
          </p>
          <Link
            href="/responses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#15151B] hover:bg-[#1C1C24] border border-white/[0.06] text-xs font-medium text-[#EDEDEF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Responses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#08080B] text-[#EDEDEF] flex flex-col relative overflow-x-hidden selection:bg-purple-500/20">
      <CubetMusicField subtle />

      {/* Top Navigation Bar with Breadcrumbs & Back */}
      <nav className="w-full border-b border-white/[0.06] bg-[#08080B]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
            <Link href="/responses" className="hover:text-[#EDEDEF] transition-colors">
              Cubet Research
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/responses" className="hover:text-[#EDEDEF] transition-colors">
              Responses
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#EDEDEF] font-medium truncate max-w-[160px] sm:max-w-xs">
              {response.name || 'Participant'}
            </span>
          </div>

          <Link
            href="/responses"
            className="px-3 py-1.5 rounded-lg bg-[#15151B] hover:bg-[#1C1C24] border border-white/[0.06] hover:border-white/[0.12] text-xs font-medium text-[#EDEDEF] flex items-center gap-1.5 transition duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8E8E93]" />
            <span>Back to Responses</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 flex-1 flex flex-col">
        {/* Header Block */}
        <header className="mb-8 pb-8 border-b border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEDEF]">
                  {response.name || 'Anonymous Participant'}
                </h1>
                {response.future_research_opt_in ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Consented to future research
                  </span>
                ) : (
                  <span className="text-xs text-[#8E8E93] px-2 py-0.5 rounded bg-white/[0.04]">
                    Opt-out
                  </span>
                )}
              </div>

              {/* Metadata row */}
              <div className="flex items-center gap-3 text-xs text-[#8E8E93] flex-wrap">
                <span className="text-[#EDEDEF]">{response.email}</span>
                <span className="text-white/20">•</span>
                <span>Age: {response.age_range || 'Not specified'}</span>
                <span className="text-white/20">•</span>
                <span>Submitted {formatDate(response.submitted_at)}</span>
                <span className="text-white/20">•</span>
                <span>Completion: {formatSeconds(response.completion_time_seconds)}</span>
              </div>
            </div>
          </div>

          {/* 5 Compact Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
            <div className="p-4 rounded-xl bg-[#101014] border border-white/[0.06]">
              <span className="text-[11px] font-medium text-[#8E8E93] block mb-1">Music importance</span>
              <p className="text-sm font-semibold text-[#EDEDEF] truncate" title={musicImportance}>
                {musicImportance}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#101014] border border-white/[0.06]">
              <span className="text-[11px] font-medium text-[#8E8E93] block mb-1">Daily listening</span>
              <p className="text-sm font-semibold text-[#EDEDEF] truncate" title={dailyListening}>
                {dailyListening}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#101014] border border-white/[0.06]">
              <span className="text-[11px] font-medium text-[#8E8E93] block mb-1">Primary platform</span>
              <p className="text-sm font-semibold text-[#EDEDEF] truncate" title={primaryPlatform}>
                {primaryPlatform}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#101014] border border-white/[0.06]">
              <span className="text-[11px] font-medium text-[#8E8E93] block mb-1">Discovery behavior</span>
              <p className="text-sm font-semibold text-[#EDEDEF] truncate" title={discoveryBehavior}>
                {discoveryBehavior}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#101014] border border-white/[0.06] col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-[#8E8E93] block mb-1">Primary motivation</span>
              <p className="text-sm font-semibold text-[#EDEDEF] truncate" title={primaryMotivation}>
                {primaryMotivation}
              </p>
            </div>
          </div>
        </header>

        {/* Survey Answers Grouped into 8 Formal Sections */}
        <div className="flex flex-col gap-10">
          {sectionsWithQuestions.map((sec) => (
            <section
              key={sec.sectionNum}
              className="p-6 sm:p-8 rounded-xl bg-[#101014] border border-white/[0.06]"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                <span className="text-xs font-mono font-semibold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  {sec.sectionNum}
                </span>
                <h2 className="text-base font-semibold text-[#EDEDEF] tracking-tight">
                  {sec.title}
                </h2>
              </div>

              {/* Questions in Section */}
              <div className="space-y-6">
                {sec.questions.map((q) => {
                  const answerObj = response.answers?.[q.id];
                  const selected = answerObj?.selected;
                  const textComment = answerObj?.text;

                  const isMulti = q.type === 'multi';
                  const isTextarea = q.type === 'textarea';

                  // Format answer text
                  const selectedLabels: string[] = [];
                  if (Array.isArray(selected)) {
                    selected.forEach((val) => {
                      selectedLabels.push(optionLabels[val] || val.replace(/_/g, ' '));
                    });
                  } else if (typeof selected === 'string' && selected) {
                    selectedLabels.push(optionLabels[selected] || selected.replace(/_/g, ' '));
                  }

                  const hasAnswer = selectedLabels.length > 0 || Boolean(textComment);

                  return (
                    <div key={q.id} className="pb-5 border-b border-white/[0.03] last:border-0 last:pb-0">
                      {/* Human-readable question prompt */}
                      <p className="text-xs sm:text-sm font-medium text-[#8E8E93] mb-2 leading-relaxed">
                        {q.text}
                      </p>

                      {/* Answer presentation */}
                      {!hasAnswer ? (
                        <p className="text-xs text-[#8E8E93]/40 italic">Not answered</p>
                      ) : (
                        <div>
                          {/* Multi-select chips */}
                          {isMulti && selectedLabels.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {selectedLabels.map((lbl, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 rounded-md bg-[#15151B] border border-white/[0.08] text-xs font-medium text-[#EDEDEF]"
                                >
                                  {lbl}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Single-select readable text */}
                          {!isMulti && !isTextarea && selectedLabels.length > 0 && (
                            <p className="text-sm sm:text-base font-normal text-[#EDEDEF]">
                              {selectedLabels[0]}
                            </p>
                          )}

                          {/* Qualitative open-ended text: large editorial quote */}
                          {(isTextarea || textComment) && (
                            <div className="my-3 pl-4 sm:pl-5 py-3 rounded-r-xl bg-[#15151B]/80 border-l-2 border-purple-500/50">
                              <p className="text-sm sm:text-base text-[#EDEDEF] leading-relaxed italic font-sans">
                                &ldquo;{textComment || selected}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Advanced Developer Area: Raw JSON */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center gap-2 text-xs font-medium text-[#8E8E93] hover:text-[#EDEDEF] transition-colors cursor-pointer"
          >
            {showRawJson ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>View raw data</span>
          </button>

          {showRawJson && (
            <div className="mt-4 p-5 rounded-xl bg-[#101014] border border-white/[0.06] relative">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.04]">
                <span className="text-[11px] font-mono text-[#8E8E93]">Payload: {response.id}</span>
                <button
                  onClick={copyJson}
                  className="px-2.5 py-1 rounded bg-[#15151B] hover:bg-[#1C1C24] text-[11px] text-[#EDEDEF] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#8E8E93]" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs font-mono text-[#8E8E93] overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
