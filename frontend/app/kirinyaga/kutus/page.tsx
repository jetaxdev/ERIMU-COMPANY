import type { Metadata } from 'next';
import { CategoryLandingPage } from '@/components/seo/CategoryLandingPage';
import { fetchPropertiesServer } from '@/lib/api-server';
import { buildLocationKeywords, siteName, siteUrl, socialImage } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Plots for Sale in Kutus | ${siteName}`,
  description: 'Browse available plots in Kutus with verified titles, clear boundaries, and competitive pricing.',
  keywords: buildLocationKeywords('Kutus'),
  metadataBase: new URL(siteUrl),
  alternates: { canonical: `${siteUrl}/kirinyaga/kutus` },
  openGraph: {
    title: `Plots for Sale in Kutus | ${siteName}`,
    description: 'Browse available plots in Kutus with verified titles, clear boundaries, and competitive pricing.',
    url: `${siteUrl}/kirinyaga/kutus`,
    siteName,
    type: 'website',
    images: [{ url: socialImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Plots for Sale in Kutus | ${siteName}`,
    description: 'Browse available plots in Kutus with verified titles, clear boundaries, and competitive pricing.',
    images: [socialImage],
  },
};

export default async function KutusPage() {
  const properties = await fetchPropertiesServer({ town: 'Kutus', limit: 12 });

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Kutus', item: `${siteUrl}/kirinyaga/kutus` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <CategoryLandingPage
        headline="Plots for Sale in Kutus"
        intro="Browse available plots in Kutus — verified titles, clear boundaries, and competitive pricing."
        summary="Find prime land in Kutus suitable for residential and investment purposes."
        locationPhrase="Kutus"
        properties={properties}
        relatedLinks={[{ href: '/kirinyaga', label: 'Kirinyaga listings' }, { href: '/kirinyaga/kagio', label: 'Kagio listings' }]}
        faq={[{ question: 'How do I pay?', answer: 'We accept full payment or installment plans — contact us for details.' }]}
        pagePath="/kirinyaga/kutus"
      />
    </>
  );
}
