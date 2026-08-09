import { siteUrl } from '@/lib/seo';

export default function robots() {
  const robotsText = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(robotsText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
