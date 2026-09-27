'use client';
// app/responses/login/page.tsx
// Secure login screen for Cubet Research with Apple / Linear minimal aesthetic

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
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

    const loginEmail = isDemo ? 'admin@cubet.space' : email;
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-sm"
    >
      <div className="bg-[#101014] border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[11px] font-medium tracking-wide uppercase text-[#8E8E93]">
            Cubet Research
          </span>
          <Link
            href="/"
            className="text-xs text-[#8E8E93] hover:text-[#EDEDEF] transition-colors"
          >
            Open Form
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDEF]">
            Sign in
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1">
            Access study responses and participant intelligence.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8E8E93] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@cubet.space"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#15151B] border border-white/[0.08] text-sm text-[#EDEDEF] placeholder-[#8E8E93] focus:outline-none focus:border-white/[0.25] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8E8E93] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#15151B] border border-white/[0.08] text-sm text-[#EDEDEF] placeholder-[#8E8E93] focus:outline-none focus:border-white/[0.25] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.04] text-center">
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            type="button"
            className="text-xs text-[#8E8E93] hover:text-[#EDEDEF] transition-colors cursor-pointer"
          >
            Sign in with demo credentials
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#08080B] text-[#EDEDEF] flex items-center justify-center p-4 relative overflow-hidden">
      <CubetMusicField subtle />
      <Suspense fallback={
        <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
          <span>Loading sign in...</span>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
