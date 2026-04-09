import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getMediaUrl } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateViewport(): Promise<Viewport> {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  let settings: any = null;
  try {
    const res = await fetch(`${API_URL}/api/settings`, { cache: 'no-store' });
    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      settings = await res.json();
    }
  } catch (e) {
    console.error("Layout viewport fetch error:", e);
  }

  return {
    themeColor: "#020617",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  let settings: any = null;
  try {
    const res = await fetch(`${API_URL}/api/settings`, { cache: 'no-store' });
    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      settings = await res.json();
    } else {
      const text = await res.text().catch(() => '');
      console.warn("Layout metadata: Received non-JSON or error response", { status: res.status, text: text.substring(0, 50) });
    }
  } catch (e) {
    console.error("Layout metadata fetch error:", e);
  }

  const siteTitle = settings?.siteName || "AimHop Security Solutions Pvt. Ltd.";
  const faviconPath = getMediaUrl(settings?.favicon) || "/favicon.ico";

  return {
    title: siteTitle,
    description: "India's leading security solutions agency. We provide highly trained security guards, electronic surveillance (CCTV), bouncers, and facility management services.",
    manifest: "/manifest.json",
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
import ArtisticBackground from "@/components/ui/ArtisticBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased font-inter bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <AppThemeProvider>
          <ArtisticBackground />
          {children}
          <WhatsAppModal isFloating />
        </AppThemeProvider>
      </body>
    </html>
  );
}
