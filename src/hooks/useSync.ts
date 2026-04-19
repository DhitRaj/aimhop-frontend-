'use client';

import { useEffect, useRef } from 'react';

/**
 * useSync Hook
 * 
 * Periodically calls a refresh function to keep data in sync.
 * Used for client-side "near real-time" updates.
 */
export function useSync(refreshFn: () => Promise<void> | void, interval = 15000, enabled = true) {
  const refreshRef = useRef(refreshFn);

  useEffect(() => {
    refreshRef.current = refreshFn;
  }, [refreshFn]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      refreshRef.current();
    };

    const timer = setInterval(tick, interval);
    return () => clearInterval(timer);
  }, [interval, enabled]);
}
