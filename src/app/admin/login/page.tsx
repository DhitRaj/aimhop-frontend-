"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, settingsAPI, isLoggedIn } from '@/lib/api';
import { getMediaUrl } from "@/lib/utils";
import { Shield, Lock, User, Loader2, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch site settings for logo/name
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.get();
        if (res.data) setSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();

    if (isLoggedIn()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email: email.toLowerCase(), password });
      
      if (!response.error) {
        // Successful login — cookies are handled by the browser
        router.push('/admin');
      } else {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 font-serif">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            {settings?.logo ? (
              <img 
                src={getMediaUrl(settings.logo)} 
                alt="Logo" 
                className="w-24 h-24 object-contain shadow-lg rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Shield size={32} strokeWidth={1.5} />
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter uppercase">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-500 font-light tracking-widest uppercase opacity-80">Administrator Portal Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aimhop.com"
                  required
                  autoComplete="email"
                  className="w-full bg-gray-50 border-2 border-gray-300 hover:border-gray-400 focus:border-amber-600 focus:bg-white rounded-lg pl-12 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:shadow-md"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-gray-50 border-2 border-gray-300 hover:border-gray-400 focus:border-amber-600 focus:bg-white rounded-lg pl-12 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:shadow-md"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
                <Shield size={16} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none disabled:opacity-70 uppercase tracking-wide text-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <p className="text-xs text-gray-600 text-center font-light">
              Demo: <span className="text-gray-800 font-semibold">admin@aimhop.com</span> / <span className="text-gray-800 font-semibold">admin123</span>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-gray-500 mt-8 font-light tracking-wide">
          © 2024 AimHop Security Solutions • Secure Access
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
