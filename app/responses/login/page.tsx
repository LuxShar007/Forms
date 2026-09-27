'use client';
// app/responses/login/page.tsx
// Secure login screen for Cubet Research authorized personnel

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import CubetMusicField from '@/components/CubetMusicField';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/responses';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, isDemo = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const loginEmail = isDemo ? 'admin@forms.com' : email;
    const loginPassword = isDemo ? 'admin123!' : password;

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, isDemo }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Successful login -> route to admin dashboard
      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-md"
    >
      <div className="bg-[#121226]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
        {/* Top accent beam */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500" />

        {/* Badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Authentication</span>
          </div>
          <Link
            href="/"
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            Back to Form
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-sm text-white/50 mt-1.5">
            Authorized access to participant survey responses, audio analytics, and research dossiers.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
              Researcher Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@forms.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
              Access Key / Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Authorization...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authenticate & Enter</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Reviewer / Fast Access Demo Option */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40 mb-3">
            Testing or evaluating without Supabase credentials?
          </p>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enter with Researcher Demo Key</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-[11px] text-white/30 font-mono">
            Protected by Supabase Auth & Edge Verification
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen bg-[#080811] text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic ambient background */}
      <CubetMusicField />

      {/* Glow aura */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -bottom-20 -right-20" />

      <Suspense
        fallback={
          <div className="text-center text-xs font-mono text-white/50">
            Initializing security tunnel...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
