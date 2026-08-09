import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://erimuproperties.com';
const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

async function fetchPropertySlugs() {
  try {
    const response = await fetch(`${backendUrl}/api/v1/properties?limit=1000`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return Array.isArray(payload.data)
      ? payload.data
          .filter((item: any) => typeof item?.slug === 'string' && item.slug.trim().length > 0)
          .map((item: any) => item.slug.trim())
      : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '/',
    '/about',
    '/properties',
    '/services',
    '/gallery',
    '/testimonials',
    '/contact',
    '/book-site-visit',
  ];

  const propertySlugs = await fetchPropertySlugs();

  const dynamicItems = propertySlugs.map((slug: any) => ({
    url: `${baseUrl}/properties/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}`, changefreq: 'daily', priority: 0.8 })),
    ...dynamicItems,
  ];
}
