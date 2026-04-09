"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, saveToken, isLoggedIn } from '@/lib/api';
import { Shield, Lock, User, Loader2, ArrowRight, Fingerprint, Command, ShieldCheck, Zap, Key } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data && response.data.token) {
        saveToken(response.data.token);
        router.push('/admin');
      } else {
        setError(response.error || 'Invalid authentication parameters.');
      }
    } catch (err) {
      setError('Network communication failed. Core offline?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 font-sans selection:bg-slate-900 selection:text-white transition-colors duration-500">
      <div className="w-full max-w-[440px] space-y-12">
        {/* Identity Section */}
        <div className="text-center space-y-8">
           <div className="inline-flex items-center justify-center">
              <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
                 <ShieldCheck size={28} />
              </div>
           </div>
           
           <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                System <span className="text-slate-400 font-medium">Authentication</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] leading-relaxed">Secure Access Protocol • Aimhop Core</p>
           </div>
        </div>

        {/* Authentication Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operator Profile</label>
              <div className="relative group">
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="ADMIN@AIMHOP.COM"
                   required
                   className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-6 py-3.5 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-1 focus:ring-slate-300 outline-none transition-all uppercase tracking-widest"
                 />
                 <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={14} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative group">
                 <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   required
                   className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-6 py-3.5 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-1 focus:ring-slate-300 outline-none transition-all"
                 />
                 <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={14} />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-lg flex items-center gap-3">
                <Shield size={14} className="text-rose-500 shrink-0" />
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[10px] uppercase tracking-[0.3em] py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-slate-900" />
                ) : (
                  <>
                    Initialize Session
                    <ArrowRight size={14} strokeWidth={3} />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-300">
                <Command size={12} />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Encrypted Session</span>
             </div>
             <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Recover Credentials</span>
          </div>
        </div>

        {/* System Meta */}
        <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.5em] opacity-40">
           Authorized Access Only • AimHop Core v2
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
