"use client";

import { ThemeProvider as PublicThemeProvider } from "@/components/ThemeProvider";
import { usePathname } from "next/navigation";
import { themeSettings } from "@/styles/theme-settings";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // We always render the provider to avoid React 19 script tag errors.
  // HOWEVER, if it's an admin page, we FORCE it to "light" so the public
  // website's dark mode doesn't affect the admin dashboard.
  // The Admin panel has its own isolated theme wrapper inside AdminLayout.
  return (
    <PublicThemeProvider
      attribute="class"
      defaultTheme={themeSettings.defaultTheme}
      forcedTheme={isAdmin ? "light" : themeSettings.forcedTheme}
      enableSystem={!isAdmin}
      disableTransitionOnChange
    >
      {children}
    </PublicThemeProvider>
  );
}
