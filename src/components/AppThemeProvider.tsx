"use client";

import { ThemeProvider as PublicThemeProvider } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation";
import { themeSettings } from "@/styles/theme-settings";
import { setCookie } from "@/lib/cookies";
import { authAPI, isLoggedIn } from "@/lib/api";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Inner component to watch for theme changes and sync them.
 * This must be inside the ThemeProvider.
 */
function ThemeWatcher() {
  const { theme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Determine actual theme
    const actualTheme = resolvedTheme || theme || 'light';
    
    // Apply to html element
    const html = document.documentElement;
    if (actualTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Sync to cookie for SSR
    setCookie("theme", actualTheme);

    // Sync to DB (if logged in)
    if (isLoggedIn() && theme && theme !== 'system') {
      authAPI.updatePreferences({ theme }).catch(() => {});
    }
  }, [theme, systemTheme, resolvedTheme, mounted]);

  return null;
}

export function AppThemeProvider({ 
  children, 
  initialTheme 
}: { 
  children: React.ReactNode;
  initialTheme?: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <PublicThemeProvider
      attribute="class"
      defaultTheme={initialTheme || themeSettings.defaultTheme}
      forcedTheme={isAdmin ? "light" : undefined}
      enableSystem={!isAdmin}
      storageKey="theme"
      themes={["light", "dark"]}
    >
      <ThemeWatcher />
      {children}
    </PublicThemeProvider>
  );
}
