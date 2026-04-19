"use client";

import { ThemeProvider as PublicThemeProvider } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation";
import { themeSettings } from "@/styles/theme-settings";
import { setCookie } from "@/lib/cookies";
import { authAPI } from "@/lib/api";
import { useTheme } from "next-themes";
import { useEffect } from "react";

/**
 * Inner component to watch for theme changes and sync them.
 * This must be inside the ThemeProvider.
 */
function ThemeWatcher() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;
    
    // Sync to cookie for SSR
    setCookie("theme", theme);

    // Sync to DB (if logged in)
    if (theme !== 'system') {
      authAPI.updatePreferences({ theme }).catch(() => {});
    }
  }, [theme]);

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
      forcedTheme={isAdmin ? "light" : themeSettings.forcedTheme}
      enableSystem={!isAdmin}
      disableTransitionOnChange
    >
      <ThemeWatcher />
      {children}
    </PublicThemeProvider>
  );
}
