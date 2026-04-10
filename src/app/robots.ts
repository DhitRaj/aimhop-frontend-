import { MetadataRoute } from 'next';

/**
 * Standard Robots.txt for AimHop Security
 * Guides search engines on what to crawl and what to avoid (admin panel).
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aimhop.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'], // Protect sensitive areas
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
