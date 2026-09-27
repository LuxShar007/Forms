'use client';
// components/admin/ResponseDossierModal.tsx
// Comprehensive deep-dive dossier view for a single participant's submission

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Mail, User, CheckCircle2, XCircle, Code, ListFilter, Copy, Check } from 'lucide-react';
import { AdminResponseItem } from '@/lib/admin/types';
import { SURVEY_QUESTIONS, SECTIONS } from '@/lib/survey/questions';

interface ResponseDossierModalProps {
  response: AdminResponseItem | null;
  onClose: () => void;
}

export default function ResponseDossierModal({
  response,
  onClose,
}: ResponseDossierModalProps) {
  const [activeTab, setActiveTab] = useState<'structured' | 'json'>('structured');
  const [copiedJson, setCopiedJson] = useState(false);

  if (!response) return null;

  const formatSeconds = (sec: number | null) => {
    if (!sec) return 'Not recorded';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s (${sec} seconds)`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Find human-readable label for an answer value
  const getAnswerDisplay = (questionId: string, val: string | string[] | undefined) => {
    if (!val) return 'No answer provided';
    const q = SURVEY_QUESTIONS.find((item) => item.id === questionId);
    if (!q || !q.options) {
      return Array.isArray(val) ? val.join(', ') : val;
    }

    if (Array.isArray(val)) {
      return val
        .map((v) => q.options?.find((opt) => opt.value === v)?.label || v)
        .join('; ');
    }

    return q.options.find((opt) => opt.value === val)?.label || val;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#0b0b18]/95 border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/20 overflow-hidden my-auto relative"
        >
          {/* Top ambient highlight line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 to-transparent" />

          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-[#0d0d22]/90 backdrop-blur-2xl flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-mono font-bold text-lg text-white shadow-lg shadow-cyan-500/20 shrink-0">
                {response.name
                  ? response.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : 'P'}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {response.name || 'Anonymous Participant'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase font-semibold">
                    ID: {response.id.slice(0, 10)}...
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-white/50 font-mono">
                  <span className="flex items-center gap-1.5 text-white/70">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    {response.email}
                  </span>
                  <span>•</span>
                  <span>Age: {response.age_range}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-white/40" />
                    {formatSeconds(response.completion_time_seconds)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab toggles */}
              <div className="flex items-center rounded-xl bg-white/[0.04] p-1 border border-white/10">
                <button
                  onClick={() => setActiveTab('structured')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'structured'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-400/30 shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Dossier</span>
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'json'
                      ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border border-purple-400/30 shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Raw JSON</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader info bar */}
          <div className="px-6 py-2.5 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between text-xs text-white/60 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                Submitted: {formatDate(response.submitted_at)}
              </span>
              <span>Survey V{response.survey_version || '1.0'}</span>
            </div>
            <div>
              {response.future_research_opt_in ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approved future contact & prototype testing
                </span>
              ) : (
                <span className="text-white/40 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  Did not opt-in for future contact
                </span>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            {activeTab === 'json' ? (
              <div className="relative">
                <button
                  onClick={handleCopyJson}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
                <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-200 overflow-x-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="space-y-8">
                {SECTIONS.map((sec) => {
                  const sectionQuestions = SURVEY_QUESTIONS.filter(
                    (q) => q.section === sec.id
                  );

                  return (
                    <div
                      key={sec.id}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/10"
                    >
                      {/* Section Title */}
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold">
                          Section {sec.id}
                        </span>
                        <h3 className="text-sm font-semibold text-white">
                          {sec.title}
                        </h3>
                      </div>

                      {/* Section Questions */}
                      <div className="space-y-4">
                        {sectionQuestions.map((q) => {
                          const ansObj = response.answers?.[q.id];
                          const selectedVal = ansObj?.selected;
                          const textVal = ansObj?.text;
                          const hasAnswer = selectedVal !== undefined || (textVal && textVal.trim().length > 0);

                          return (
                            <div
                              key={q.id}
                              className="pl-3 border-l-2 border-white/10 hover:border-cyan-400/50 transition-colors"
                            >
                              <div className="text-xs font-mono text-white/40 mb-1">
                                Q{q.questionNumber}: {q.text}
                              </div>

                              {hasAnswer ? (
                                <div className="space-y-1.5">
                                  {selectedVal !== undefined && (
                                    <div className="text-sm font-medium text-white/90">
                                      {getAnswerDisplay(q.id, selectedVal)}
                                    </div>
                                  )}
                                  {textVal && (
                                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-200 text-xs italic">
                                      "{textVal}"
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-white/30 italic">
                                  Skipped / Not answered
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-[#14142d] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
