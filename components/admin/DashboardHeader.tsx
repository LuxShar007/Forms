'use client';
// components/admin/DashboardHeader.tsx
// Minimal, sophisticated Apple / Linear / Vercel style header for Cubet Research

import { Download, LogOut, ExternalLink, RefreshCw } from 'lucide-react';
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
    <header className="w-full border-b border-white/[0.06] bg-[#08080B]/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Cubet Research / Music Experience Study */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium tracking-wide uppercase text-[#8E8E93]">
              Cubet Research
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-[#EDEDEF]">
            Music Experience Study
          </h1>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            {totalResponses} {totalResponses === 1 ? 'response' : 'responses'} · Updated just now
          </p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh Data"
            className="px-3 py-1.5 rounded-lg bg-[#15151B] hover:bg-[#1C1C24] border border-white/[0.06] hover:border-white/[0.12] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 transition duration-150 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8E8E93] ${refreshing ? 'animate-spin text-purple-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            title="Export responses as CSV"
            className="px-3 py-1.5 rounded-lg bg-[#15151B] hover:bg-[#1C1C24] border border-white/[0.06] hover:border-white/[0.12] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 transition duration-150 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#8E8E93]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <Link
            href="/"
            target="_blank"
            title="Open Live Public Form"
            className="px-3 py-1.5 rounded-lg bg-[#15151B] hover:bg-[#1C1C24] border border-white/[0.06] hover:border-white/[0.12] text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 transition duration-150"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8E8E93]" />
            <span className="hidden md:inline">Open Live Form</span>
          </Link>

          <div className="h-4 w-px bg-white/[0.08] mx-1 hidden sm:block" />

          <button
            onClick={onLogout}
            title="Sign out of Admin"
            className="px-3 py-1.5 rounded-lg bg-transparent hover:bg-white/[0.04] text-[#8E8E93] hover:text-[#EDEDEF] text-xs font-medium flex items-center gap-1.5 transition duration-150 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
