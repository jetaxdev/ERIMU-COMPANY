import { siteUrl } from '@/lib/seo';

export async function GET() {
  const robotsText = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;

  return new Response(robotsText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
