"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, saveToken, isLoggedIn } from '@/lib/api';
import { Shield, Lock, User, Loader2, ArrowRight } from "lucide-react";

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
        setError(response.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Connection failed. Server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-600 rounded-xl shadow-lg border-2 border-white dark:border-slate-800 text-white font-bold">
              <Shield size={24} />
           </div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Admin <span className="text-sky-600">Portal</span></h1>
           <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Aimhop Security Solutions</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identification</label>
              <div className="relative">
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="admin@aimhop.com"
                   required
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                 />
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                 <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   required
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                 />
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[11px] font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white font-bold py-4 rounded-xl hover:bg-sky-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-sky-600/10"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
           Encrypted Connection Established
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
