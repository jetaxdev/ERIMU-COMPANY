import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PropertyDetailPage from '@/components/property/property-detail-page';
import { fetchPropertyBySlug, fetchPropertySlugs } from '@/lib/api-server';
import { siteUrl, siteName, socialImage } from '@/lib/seo';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await fetchPropertySlugs();
  return slugs.map((s) => ({ slug: s }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const property = await fetchPropertyBySlug(slug);
  if (!property) {
    return {
      title: `Property not found | ${siteName}`,
    };
  }

  const title = `${property.title} | ${siteName}`;
  const description = property.description || `Buy land: ${property.title} in ${property.location || property.town || property.county || 'Kirinyaga'}.`;
  const url = `${siteUrl}/properties/${property.slug}`;
  const image = property.images?.[0]?.url || socialImage;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const property = await fetchPropertyBySlug(params.slug);
  if (!property) return notFound();

  const price = property.price ? String(property.price) : undefined;
  const availability = property.status === 'AVAILABLE' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut';

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description || undefined,
    url: `${siteUrl}/properties/${property.slug}`,
    image: property.images?.map((i) => i.url) || [socialImage],
    sku: property.slug,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'KES',
      availability,
      url: `${siteUrl}/properties/${property.slug}`,
      seller: { '@type': 'Organization', name: siteName },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PropertyDetailPage property={property} />
    </>
  );
}

