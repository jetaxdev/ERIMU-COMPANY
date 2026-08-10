import type { Metadata } from 'next';
import { CategoryLandingPage } from '@/components/seo/CategoryLandingPage';
import { fetchPropertiesServer } from '@/lib/api-server';
import { buildLocationKeywords, siteName, siteUrl, socialImage } from '@/lib/seo';

export const revalidate = 60; // regenerate often for fresh listings

export const metadata: Metadata = {
  title: `Land & Plots for Sale in Kirinyaga | ${siteName}`,
  description: 'Browse verified land and plots for sale across Kirinyaga County, including Kutus and Kagio. Find properties with clear titles and local support.',
  keywords: buildLocationKeywords('Kirinyaga'),
  metadataBase: new URL(siteUrl),
  alternates: { canonical: `${siteUrl}/kirinyaga` },
  openGraph: {
    title: `Land & Plots for Sale in Kirinyaga | ${siteName}`,
    description: 'Browse verified land and plots for sale across Kirinyaga County, including Kutus and Kagio. Find properties with clear titles and local support.',
    url: `${siteUrl}/kirinyaga`,
    siteName,
    type: 'website',
    images: [{ url: socialImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Land & Plots for Sale in Kirinyaga | ${siteName}`,
    description: 'Browse verified land and plots for sale across Kirinyaga County, including Kutus and Kagio. Find properties with clear titles and local support.',
    images: [socialImage],
  },
};

export default async function KirinyagaPage() {
  const properties = await fetchPropertiesServer({ county: 'Kirinyaga', limit: 12 });

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Kirinyaga', item: `${siteUrl}/kirinyaga` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <CategoryLandingPage
        headline="Land & Plots for Sale in Kirinyaga"
        intro="Explore verified land for sale across Kirinyaga County, including Kutus and Kagio. Find secure investments with transparent documentation."
        summary="Erimu Properties lists verified plots with clear titles, competitive pricing, and flexible payment plans in Kirinyaga County."
        locationPhrase="Kirinyaga County"
        properties={properties}
        relatedLinks={[{ href: '/kirinyaga/kutus', label: 'Kutus properties' }, { href: '/kirinyaga/kagio', label: 'Kagio properties' }]}
        faq={[
          { question: 'Are plots verified?', answer: 'Yes — we verify titles and ownership before listing.' },
          { question: 'Can I schedule a site visit?', answer: 'Yes — book a visit from the property page or contact us directly.' },
        ]}
        pagePath="/kirinyaga"
      />
    </>
  );
}
