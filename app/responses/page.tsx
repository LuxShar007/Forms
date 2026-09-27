'use client';
// app/responses/page.tsx
// Private Admin Response Dashboard with live blurred chromatic video background

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, MessageSquareQuote, Loader2 } from 'lucide-react';
import DashboardHeader from '@/components/admin/DashboardHeader';
import StatsKpis from '@/components/admin/StatsKpis';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import ResponsesTableTab from '@/components/admin/ResponsesTableTab';
import QualitativeTab from '@/components/admin/QualitativeTab';
import ResponseDossierModal from '@/components/admin/ResponseDossierModal';
import CubetMusicField from '@/components/CubetMusicField';
import { AdminResponseItem, AdminStats } from '@/lib/admin/types';
import { MOCK_RESPONSES } from '@/lib/admin/mockData';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [responses, setResponses] = useState<AdminResponseItem[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    completed: 0,
    today: 0,
    avgCompletionSeconds: 0,
    futureOptIns: 0,
  });
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<AdminResponseItem | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'table' | 'qualitative'>('analytics');

  const fetchData = useCallback(async () => {
    try {
      const [resStats, resList] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/responses?limit=100'),
      ]);

      if (resStats.status === 401 || resList.status === 401) {
        router.push('/responses/login');
        return;
      }

      const statsData = await resStats.json();
      const listData = await resList.json();

      if (listData.responses && Array.isArray(listData.responses)) {
        setResponses(listData.responses);
        setIsLive(listData.isLive ?? false);
      } else {
        setResponses(MOCK_RESPONSES);
      }

      if (statsData && !statsData.error) {
        setStats(statsData);
      }
    } catch {
      setResponses(MOCK_RESPONSES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // ignore
    }
    router.push('/responses/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        <CubetMusicField />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-white/50 tracking-wider uppercase">
            Loading Survey Responses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#070711] text-white flex flex-col relative overflow-x-hidden">
      {/* Live blurred chromatic video background */}
      <CubetMusicField />

      {/* Top Header */}
      <DashboardHeader
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        refreshing={refreshing}
        isLive={isLive}
        totalResponses={responses.length}
      />

      {/* Main Container */}
      <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 relative z-10 flex flex-col">
        {/* KPI Metric Summary */}
        <StatsKpis stats={stats} responses={responses} />

        {/* Tab Navigation Segmented Bar */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/[0.08] mb-8 pb-5">
          <div className="flex items-center p-1.5 rounded-2xl bg-[#0b0b18]/90 border border-white/10 backdrop-blur-2xl w-fit shadow-2xl shadow-black/40">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-indigo-500/25 text-cyan-200 border border-cyan-400/40 shadow-lg shadow-cyan-500/15'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-cyan-300' : 'text-white/40'}`} />
              <span>Visual Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-gradient-to-r from-purple-500/25 via-violet-500/25 to-indigo-500/25 text-purple-200 border border-purple-400/40 shadow-lg shadow-purple-500/15'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'table' ? 'text-purple-300' : 'text-white/40'}`} />
              <span>Participants</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'table'
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                  : 'bg-white/10 text-white/60'
              }`}>
                {responses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('qualitative')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'qualitative'
                  ? 'bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-cyan-500/25 text-emerald-200 border border-emerald-400/40 shadow-lg shadow-emerald-500/15'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <MessageSquareQuote className={`w-4 h-4 ${activeTab === 'qualitative' ? 'text-emerald-300' : 'text-white/40'}`} />
              <span>Quotes & Voices</span>
            </button>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono text-white/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-[11px] text-white/70">Real-Time Sync Active</span>
            </div>
          </div>
        </div>

        {/* Active Tab View with smooth transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'analytics' && <AnalyticsTab responses={responses} />}
            {activeTab === 'table' && (
              <ResponsesTableTab
                responses={responses}
                onSelectResponse={(r) => setSelectedResponse(r)}
              />
            )}
            {activeTab === 'qualitative' && (
              <QualitativeTab
                responses={responses}
                onSelectResponse={(r) => setSelectedResponse(r)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Response Dossier Modal */}
      <ResponseDossierModal
        response={selectedResponse}
        onClose={() => setSelectedResponse(null)}
      />
    </div>
  );
}
