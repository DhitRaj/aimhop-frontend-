import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getMediaUrl } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  let settings: any = null;
  try {
    const res = await fetch(`${API_URL}/api/settings`, { cache: 'no-store' });
    settings = await res.json();
  } catch (e) {
    console.error("Layout metadata fetch error:", e);
  }

  const siteTitle = settings?.siteName || "AimHop Security Solutions Pvt. Ltd.";
  const faviconPath = getMediaUrl(settings?.favicon) || "/favicon.ico";

  return {
    title: siteTitle,
    description: "India's leading security solutions agency. We provide highly trained security guards, electronic surveillance (CCTV), bouncers, and facility management services.",
    manifest: "/manifest.json",
    themeColor: "#020617",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    icons: {
      icon: faviconPath,
      shortcut: faviconPath,
      apple: faviconPath,
    },
    openGraph: {
      title: siteTitle,
      description: "Reliable Protection & Facility Management Across India",
      url: "https://aimhop.com",
      siteName: siteTitle,
      locale: "en_IN",
      type: "website",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "AimHop",
    },
  };
}

import { AppThemeProvider } from "@/components/AppThemeProvider";
import { WhatsAppModal } from "@/components/WhatsAppModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased font-inter bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <AppThemeProvider>
          {children}
          <WhatsAppModal isFloating />
        </AppThemeProvider>
      </body>
    </html>
  );
}
