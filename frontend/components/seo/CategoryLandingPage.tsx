import Link from 'next/link';
import { PropertyCard } from '@/components/property/property-card';
import type { PropertyRecord } from '@/services/api/properties';

type RelatedLink = {
  href: string;
  label: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type CategoryLandingPageProps = {
  headline: string;
  intro: string;
  summary: string;
  locationPhrase: string;
  properties: PropertyRecord[];
  relatedLinks: RelatedLink[];
  faq: FAQItem[];
  pagePath: string;
};

export function CategoryLandingPage({
  headline,
  intro,
  summary,
  locationPhrase,
  properties,
  relatedLinks,
  faq,
  pagePath,
}: CategoryLandingPageProps) {
  return (
    <main className="bg-white text-slate-900">
      <section className="bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.15),transparent_45%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-900 sm:text-4xl">{headline}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">{intro}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 transition hover:border-red-600 hover:bg-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-red-600">{locationPhrase}</p>
            <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-900 sm:text-3xl">Find the right land and plots in Kirinyaga</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{summary}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Why this page helps</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>Browse current Kirinyaga listings with real property details.</li>
              <li>See verified properties in Kutus, Kagio, and nearby locations.</li>
              <li>Connect with Erimu Properties for site visits and purchase guidance.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-red-600">Local listings</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-900 sm:text-3xl">Available Properties</h2>
          </div>
          <Link href="/properties" className="text-sm font-semibold text-red-600 transition hover:text-red-700">
            View all properties →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                title={property.title}
                slug={property.slug}
                location={property.town || property.location || 'Kirinyaga'}
                county={property.county}
                price={property.price}
                size={property.plotSize || (property.areaSqft ? `${property.areaSqft} sqft` : 'Size on request')}
                status={property.status}
                featuredImage={property.images[0]?.url || '/erimuland%20logo.png'}
                amenities={property.amenities.map((item) => item.name)}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-700 shadow-sm">
              <p className="text-lg font-semibold">No matching properties found at the moment.</p>
              <p className="mt-2 text-sm text-slate-500">Check back soon for new land and plot listings in the area.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-900">Frequently asked questions</h3>
          <div className="mt-6 space-y-5">
            {faq.map((item) => (
              <div key={item.question}>
                <p className="text-base font-semibold text-slate-900">{item.question}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
