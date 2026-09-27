'use client';
// app/responses/page.tsx
// Cubet Research Admin UI: Apple + Linear + Vercel calm data-intelligence dashboard

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DashboardHeader from '@/components/admin/DashboardHeader';
import StatsKpis from '@/components/admin/StatsKpis';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import ResponsesTableTab from '@/components/admin/ResponsesTableTab';
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
      <div className="min-h-screen bg-[#08080B] text-[#EDEDEF] flex flex-col items-center justify-center gap-3 relative overflow-hidden">
        <CubetMusicField subtle />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <p className="text-xs text-[#8E8E93] tracking-wide">
            Loading study data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#08080B] text-[#EDEDEF] flex flex-col relative overflow-x-hidden selection:bg-purple-500/20">
      {/* Calm near-static atmospheric background */}
      <CubetMusicField subtle />

      {/* Minimal Header */}
      <DashboardHeader
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        refreshing={refreshing}
        isLive={isLive}
        totalResponses={responses.length}
      />

      {/* Main Container - 1440px centered */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 flex-1 flex flex-col">
        {/* KPI Row (4 Cards) */}
        <StatsKpis stats={stats} responses={responses} />

        {/* Section Heading: Research Analytics */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">Research Analytics</h2>
            <p className="text-xs text-[#8E8E93] mt-0.5">Aggregated behavioral patterns and participant insights</p>
          </div>
        </div>

        {/* 6 Research Analytics Charts */}
        <AnalyticsTab responses={responses} />

        {/* Dedicated Responses Section with Table & Filters */}
        <ResponsesTableTab responses={responses} />
      </main>
    </div>
  );
}
