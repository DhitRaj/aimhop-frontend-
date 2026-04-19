'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SyncHandlerProps {
  interval?: number; // In milliseconds
  enabled?: boolean;
}

/**
 * SyncHandler
 * 
 * Periodically triggers a router refresh to fetch latest data from the server.
 * This is "near real-time sync" using short-polling on the client.
 * 
 * router.refresh() in Next.js 13+ re-runs server components on the server, 
 * fetches fresh data (subject to cache-tags and revalidation), and sends 
 * only the necessary diffs back to the client, preserving client state.
 */
export function SyncHandler({ interval = 10000, enabled = true }: SyncHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      console.log('[Sync] Refreshing page data...');
      router.refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [router, interval, enabled]);

  return null;
}
