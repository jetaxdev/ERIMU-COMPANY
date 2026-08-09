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

                setSubmittingVisit(true);

                try {
                  await createSiteVisit({
                    propertyId: property.id,
                    fullName: visitForm.fullName.trim(),
                    phone: visitForm.phone.trim(),
                    email: visitForm.email.trim() || undefined,
                    visitDate: new Date(visitForm.visitDate).toISOString(),
                  });

                  setVisitFeedback({
                    type: 'success',
                    message: 'Site visit request sent successfully. Our team will follow up shortly.',
                  });

                  setVisitForm((prev) => ({
                    ...prev,
                    phone: '',
                  }));
                } catch {
                  setVisitFeedback({
                    type: 'error',
                    message: 'Failed to send site visit request. Please try again.',
                  });
                } finally {
                  setSubmittingVisit(false);
                }
              }}
            >
              <input
                required
                type="text"
                value={visitForm.fullName}
                onChange={(event) => setVisitForm((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="Full name"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring"
              />

              <input
                required
                type="tel"
                value={visitForm.phone}
                onChange={(event) => setVisitForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Phone number"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring"
              />

              <input
                type="email"
                value={visitForm.email}
                onChange={(event) => setVisitForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email (optional)"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring"
              />

              <input
                required
                type="date"
                value={visitForm.visitDate}
                onChange={(event) => setVisitForm((prev) => ({ ...prev, visitDate: event.target.value }))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring"
              />

              <button
                type="submit"
                disabled={submittingVisit}
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingVisit ? 'Sending Request...' : 'Send Site Visit Request'}
              </button>

              {visitFeedback ? (
                <p
                  className={`rounded-md px-3 py-2 text-xs ${
                    visitFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {visitFeedback.message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Property Description</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
            {property.description || 'A strategic land investment opportunity with ready documentation and excellent growth potential.'}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Amenities</h2>
          {amenities.length > 0 ? (
            <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {amenities.map((item) => (
                <li key={item} className="rounded-md border border-slate-200 px-3 py-2">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Amenities not specified for this property yet.</p>
          )}
        </article>
      </section>

      {suggested.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-slate-900">You May Also Like</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {suggested.map((item) => {
              const image = pickImage(item);
              return (
                <article key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                  <div className="space-y-1 p-4">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.town || item.location || item.county || 'Prime location'}</p>
                    <p className="text-sm font-bold text-red-600">From {formatKES(item.price)}</p>
                    <Link href={`/properties/${item.slug}`} className="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
