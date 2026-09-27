'use client';
// components/admin/DashboardHeader.tsx
// Elevated, modern header for the responses dashboard

import { ShieldCheck, Download, LogOut, ExternalLink, RefreshCw, Database, Layers } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  refreshing: boolean;
  isLive: boolean;
  totalResponses: number;
}

export default function DashboardHeader({
  onRefresh,
  onLogout,
  refreshing,
  isLive,
  totalResponses,
}: DashboardHeaderProps) {
  const handleExportCsv = () => {
    window.open('/api/admin/export', '_blank');
  };

  return (
    <header className="w-full border-b border-white/[0.08] bg-[#070712]/75 backdrop-blur-2xl sticky top-0 z-30 shadow-2xl shadow-black/40">
      {/* Top subtle specular ambient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 via-violet-500/30 to-transparent" />

      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 h-20 flex items-center justify-between">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-80 transition duration-300" />
            <div className="relative w-11 h-11 rounded-2xl bg-[#0b0b18] border border-white/15 flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-cyan-300" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans flex items-center gap-2">
                <span>Survey Responses</span>
              </h1>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold tracking-wider shadow-sm shadow-cyan-500/10">
                Executive Console
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs">
              <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
                </span>
                <span className="font-mono text-[11px] text-white/60 flex items-center gap-1.5">
                  {isLive ? (
                    <>
                      <Database className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300/90 font-medium">Supabase Live DB</span>
                    </>
                  ) : (
                    <span>Local Storage Active</span>
                  )}
                </span>
              </div>

              <span className="text-white/20">•</span>

              <span className="text-[11px] font-mono text-white/70">
                <strong className="text-white font-semibold">{totalResponses}</strong> Verified Submissions
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh Data"
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-xs font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : 'text-white/60'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 hover:from-cyan-500/25 hover:via-blue-500/25 hover:to-indigo-500/25 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-200 text-xs font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-semibold">Export CSV</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-xs font-medium flex items-center gap-2 transition-all duration-200 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white/60" />
            <span className="hidden md:inline">Open Live Form</span>
          </Link>

          <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/40 text-rose-300 hover:text-rose-200 text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
