import type { Metadata, Viewport } from "next";
import { DM_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { getMediaUrl } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export async function generateViewport(): Promise<Viewport> {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  let settings: any = null;
  try {
    const res = await fetch(`${API_URL}/api/v1/settings`, { next: { tags: ['settings'], revalidate: 3600 } });
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
  let seoData: any = null;
  
  try {
    const [resSettings, resSeo] = await Promise.all([
      fetch(`${API_URL}/api/v1/settings`, { next: { tags: ['settings'], revalidate: 3600 } }),
      fetch(`${API_URL}/api/v1/seo/route/${encodeURIComponent('/')}`, { next: { tags: ['seo', 'seo-/'], revalidate: 3600 } })
    ]);
    
    if (resSettings.ok) settings = await resSettings.json();
    
    if (resSeo.ok) {
      const seoJson = await resSeo.json();
      seoData = seoJson?.data || null;
    }
  } catch (e) {
    console.error("Layout metadata fetch error:", e);
  }

  const siteTitle = settings?.siteName || "AimHop Security Solutions Pvt. Ltd.";
  const defaultDesc = "India's leading security solutions agency. We provide highly trained security guards, electronic surveillance (CCTV), bouncers, and facility management services.";
  
  const faviconPath = settings?.favicon 
    ? `${getMediaUrl(settings.favicon)}${settings.updatedAt ? '?v=' + new Date(settings.updatedAt).getTime() : ''}` 
    : "/favicon.ico";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aimhop.com";
  const finalTitle = seoData?.metaTitle || siteTitle;
  const finalDescription = seoData?.metaDescription || settings?.siteDescription || defaultDesc;
  const finalOgImage = seoData?.ogImage || "/og-image.jpg";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: finalTitle,
      template: `%s | ${siteTitle}`,
    },
    description: finalDescription,
    applicationName: "AimHop",
    keywords: seoData?.keywords?.length > 0 ? seoData.keywords : [
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
      canonical: seoData?.canonicalUrl || "/",
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
      title: finalTitle,
      description: finalDescription,
      url: baseUrl,
      siteName: siteTitle,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      creator: "@aimhop",
      images: [finalOgImage],
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
import { ThemeScript } from "@/components/ThemeScript";
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
    <html lang="en" className={`${dmSans.variable} ${bricolageGrotesque.variable} ${theme === 'dark' ? 'dark' : ''}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased bg-background text-foreground transition-colors duration-200">
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
