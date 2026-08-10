import type { Metadata } from 'next';
import { CategoryLandingPage } from '@/components/seo/CategoryLandingPage';
import { fetchPropertiesServer } from '@/lib/api-server';
import { buildLocationKeywords, siteName, siteUrl, socialImage } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Plots for Sale in Kagio | ${siteName}`,
  description: 'Explore available land in Kagio with verified documentation and convenient access to local amenities.',
  keywords: buildLocationKeywords('Kagio'),
  metadataBase: new URL(siteUrl),
  alternates: { canonical: `${siteUrl}/kirinyaga/kagio` },
  openGraph: {
    title: `Plots for Sale in Kagio | ${siteName}`,
    description: 'Explore available land in Kagio with verified documentation and convenient access to local amenities.',
    url: `${siteUrl}/kirinyaga/kagio`,
    siteName,
    type: 'website',
    images: [{ url: socialImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Plots for Sale in Kagio | ${siteName}`,
    description: 'Explore available land in Kagio with verified documentation and convenient access to local amenities.',
    images: [socialImage],
  },
};

export default async function KagioPage() {
  const properties = await fetchPropertiesServer({ town: 'Kagio', limit: 12 });

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Kagio', item: `${siteUrl}/kirinyaga/kagio` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <CategoryLandingPage
        headline="Plots for Sale in Kagio"
        intro="Explore available land in Kagio with verified documentation and convenient access to local amenities."
        summary="Kagio offers strategic locations for residential and investment plots — view current listings below."
        locationPhrase="Kagio"
        properties={properties}
        relatedLinks={[{ href: '/kirinyaga', label: 'Kirinyaga listings' }, { href: '/kirinyaga/kutus', label: 'Kutus listings' }]}
        faq={[{ question: 'Can I reserve a plot?', answer: 'Yes — contact us to reserve and pay a holding deposit.' }]}
        pagePath="/kirinyaga/kagio"
      />
    </>
  );
}
