import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryLandingPage } from '@/components/seo/CategoryLandingPage';
import { fetchPropertiesServer } from '@/lib/api-server';
import { buildLocationKeywords, siteName, siteUrl, socialImage } from '@/lib/seo';

function formatTownName(town: string) {
  return town
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function getTownDescription(town: string) {
  const displayName = formatTownName(town);
  return `Browse verified plots for sale in ${displayName}, Kirinyaga. Find local land listings with clear title documentation and trusted purchase support.`;
}

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    town: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const displayName = formatTownName(params.town);
  const title = `Plots for Sale in ${displayName} | ${siteName}`;
  const description = getTownDescription(params.town);
  const url = `${siteUrl}/kirinyaga/${encodeURIComponent(params.town)}`;

  return {
    title,
    description,
    keywords: buildLocationKeywords(displayName),
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website',
      images: [{ url: socialImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}

export default async function TownPage({ params }: Props) {
  const town = params.town;
  const properties = await fetchPropertiesServer({ town, limit: 100 });

  if (!properties.length) {
    return notFound();
  }

  const displayName = formatTownName(town);
  const description = getTownDescription(town);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Kirinyaga', item: `${siteUrl}/kirinyaga` },
      { '@type': 'ListItem', position: 3, name: displayName, item: `${siteUrl}/kirinyaga/${encodeURIComponent(town)}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <CategoryLandingPage
        headline={`Plots for Sale in ${displayName}`}
        intro={`Browse available plots in ${displayName} with verified titles and trusted local support.`}
        summary={description}
        locationPhrase={displayName}
        properties={properties}
        relatedLinks={[
          { href: '/kirinyaga', label: 'Kirinyaga listings' },
          { href: '/kirinyaga/kutus', label: 'Kutus listings' },
          { href: '/kirinyaga/kagio', label: 'Kagio listings' },
        ]}
        faq={[
          { question: 'Can I book a site visit?', answer: 'Yes — book a site visit directly from the property detail page or contact us for help.' },
          { question: 'Are these plots verified?', answer: 'Yes — we verify title and ownership details before listing any plot.' },
        ]}
        pagePath={`/kirinyaga/${encodeURIComponent(town)}`}
      />
    </>
  );
}
