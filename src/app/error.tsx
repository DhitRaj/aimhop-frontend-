'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Root Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-8">
        <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Something went wrong</h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/50 py-1.5 px-3 rounded-full border border-slate-100 dark:border-slate-800 inline-block">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => reset()}
            className="w-full btn-primary rounded-xl h-12 flex items-center justify-center gap-2 group"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
            Try Again
          </button>
          
          <Link href="/" className="w-full btn-secondary rounded-xl h-12 flex items-center justify-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        <p className="text-sm text-slate-500">
          Need help? <a href="mailto:support@aimhop.com" className="text-sky-600 dark:text-sky-400 hover:underline font-semibold">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
