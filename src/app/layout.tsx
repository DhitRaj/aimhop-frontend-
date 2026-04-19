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
    const res = await fetch(`${API_URL}/api/v1/settings`, { cache: 'no-store' });
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
    const res = await fetch(`${API_URL}/api/v1/settings`, { cache: 'no-store' });
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
  const siteDescription = settings?.siteDescription || "India's leading security solutions agency. We provide highly trained security guards, electronic surveillance (CCTV), bouncers, and facility management services.";
  const faviconPath = settings?.favicon 
    ? `${getMediaUrl(settings.favicon)}${settings.updatedAt ? '?v=' + new Date(settings.updatedAt).getTime() : ''}` 
    : "/favicon.ico";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aimhop.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    applicationName: "AimHop",
    keywords: [
      "Security Guards", 
      "CCTV Surveillance", 
      "Bouncers", 
      "Facility Management", 
      "Security Agency India", 
      "AimHop Security",
      "Professional Bodyguards",
      "Event Security",
      "Industrial Security"
    ],
    authors: [{ name: "AimHop Team" }],
    creator: "AimHop Security Solutions",
    publisher: "AimHop Security Solutions Pvt. Ltd.",
    formatDetection: {
      email: false,
      address: false,
      telephone: true,
    },
    alternates: {
      canonical: "/",
    },
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: faviconPath },
        { url: faviconPath, sizes: "32x32", type: "image/png" },
      ],
      shortcut: faviconPath,
      apple: faviconPath,
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: baseUrl,
      siteName: siteTitle,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/og-image.jpg", // Make sure this exists or use a dynamic one
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      creator: "@aimhop",
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "AimHop",
    },
    category: "Security Services",
  };
}

import { AppThemeProvider } from "@/components/AppThemeProvider";
import { WhatsAppModal } from "@/components/WhatsAppModal";
import ArtisticBackground from "@/components/ui/ArtisticBackground";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  let settings: any = null;
  try {
    const res = await fetch(`${API_URL}/api/v1/settings`, { cache: 'no-store' });
    if (res.ok) {
      settings = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch settings in layout", error);
  }

  return (
    <html lang="en" className={`${inter.variable} ${theme}`} suppressHydrationWarning style={{ colorScheme: theme }}>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        <AppThemeProvider initialTheme={theme}>
          <ArtisticBackground />
          <div className="relative flex flex-col min-h-screen">
            {children}
          </div>
          <WhatsAppModal isFloating whatsappNumber={settings?.whatsappNumber} />
        </AppThemeProvider>
      </body>
    </html>
  );
}
