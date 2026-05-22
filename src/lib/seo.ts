/**
 * Server-side SEO data fetcher for use in generateMetadata() functions.
 * Fetches route-specific SEO data from the backend with caching.
 */
export async function getPageSEO(pageRoute: string) {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  
  try {
    const res = await fetch(`${API_URL}/api/v1/seo/route/${pageRoute}`, {
      next: { tags: ['seo', `seo-${pageRoute}`], revalidate: 3600 }
    });
    
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        return json?.data || null;
      }
    }
  } catch (error) {
    // Silently fail — let the page use its own default metadata
    console.error(`SEO fetch error for route "${pageRoute}":`, error);
  }
  
  return null;
}

/**
 * Merges dynamic SEO data with page defaults.
 * Dynamic data takes priority; null/undefined fields fall back to defaults.
 */
export function mergeSEO(
  seoData: any,
  defaults: { title: string; description: string; keywords?: string[] }
) {
  return {
    title: seoData?.metaTitle || defaults.title,
    description: seoData?.metaDescription || defaults.description,
    keywords: seoData?.keywords?.length > 0 ? seoData.keywords : (defaults.keywords || []),
    ogImage: seoData?.ogImage || undefined,
    canonicalUrl: seoData?.canonicalUrl || undefined,
  };
}
