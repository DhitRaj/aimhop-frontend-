import { MetadataRoute } from 'next';
import { blogAPI } from '@/lib/api';

/**
 * Dynamic Sitemap Generator for AimHop Security
 * Automatically updates as new pages or blog posts are added.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aimhop.com';

  // Base static pages
  const staticPages = [
    '',
    '/about',
    '/services',
    '/contact',
    '/blogs',
    '/careers',
    '/clients',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Blog Pages
  let blogEntries: any[] = [];
  try {
    const res = await blogAPI.getAll();
    if (res.data && Array.isArray(res.data)) {
      blogEntries = res.data.map((blog: any) => ({
        url: `${siteUrl}/blogs/${blog._id}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Sitemap Blog Fetch Error:', error);
  }

  return [...staticPages, ...blogEntries];
}
