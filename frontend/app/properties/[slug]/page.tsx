'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';
import { getProperties, getPropertyBySlug, PropertyRecord, PropertyStatus } from '@/services/api/properties';
import { createSiteVisit } from '@/services/api/site-visits';

const heroImage =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80';

type DetailPageProps = {
  params: {
    slug: string;
  };
};

function formatKES(price?: number | null) {
  if (!price) return 'Contact for price';
  return `KES ${new Intl.NumberFormat('en-KE').format(price)}`;
}

function pretty(text: string) {
  return text
    .toLowerCase()
    .split('_')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
}

function statusClass(status: PropertyStatus) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-blue-600';
    case 'RESERVED':
      return 'bg-orange-500';
    case 'SOLD':
      return 'bg-red-500';
    default:
      return 'bg-slate-700';
  }
}

function deriveSize(property: PropertyRecord) {
  if (property.plotSize?.trim()) return property.plotSize;
  if (property.areaSqft) return `${property.areaSqft} sqft`;
  return 'Size on request';
}

function pickImage(property: PropertyRecord) {
  const featured = property.featuredImageId
    ? property.images.find((image) => image.id === property.featuredImageId)?.url
    : undefined;

  return featured || property.images[0]?.url || heroImage;
}

export default function PropertyDetailPage({ params }: DetailPageProps) {
  const [property, setProperty] = useState<PropertyRecord | null>(null);
  const [suggested, setSuggested] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [submittingVisit, setSubmittingVisit] = useState(false);
  const [visitFeedback, setVisitFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [visitForm, setVisitForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    visitDate: '',
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getPropertyBySlug(params.slug);

        if (!mounted) {
          return;
        }

        setProperty(result);
        setActiveImage(pickImage(result));

        const list = await getProperties({ limit: 8, page: 1 });
        if (!mounted) {
          return;
        }

        setSuggested(list.data.filter((item) => item.id !== result.id).slice(0, 4));
      } catch {
        if (!mounted) {
          return;
        }

        setError('Property details are unavailable right now.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [params.slug]);

  const gallery = useMemo(() => {
    if (!property) return [];

    const featured = pickImage(property);
    const rest = property.images.map((item) => item.url).filter((url) => url && url !== featured);
    return [featured, ...rest].slice(0, 8);
  }, [property]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-700 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-10 text-center">
          Loading property details...
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
          <p>{error || 'Property not found.'}</p>
          <Link href="/properties" className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Back to Properties
          </Link>
        </div>
      </main>
    );
  }

  const plotSize = deriveSize(property);
  const location = property.location || property.town || property.county || 'Prime Location';
  const amenities = property.amenities.map((item) => pretty(item.name));

  return (
    <main className="bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/erimuventures%20logo%20updated.png"
              alt="Erimu Ventures"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            <Link href="/" className="transition hover:text-red-600">Home</Link>
            <Link href="/properties" className="text-red-600">Properties</Link>
            <Link href="/about" className="transition hover:text-red-600">About Us</Link>
            <Link href="/services" className="transition hover:text-red-600">Services</Link>
            <Link href="/gallery" className="transition hover:text-red-600">Gallery</Link>
            <Link href="/testimonials" className="transition hover:text-red-600">Testimonials</Link>
            <Link href="/contact" className="transition hover:text-red-600">Contact Us</Link>
          </nav>

          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:inline-flex"
          >
            <CalendarDays className="h-4 w-4" />
            Book Site Visit
          </Link>
          <MobileNavMenu currentPath="/properties" />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>›</span>
          <Link href="/properties" className="hover:text-red-600">Properties</Link>
          <span>›</span>
          <span className="text-red-600">{property.title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative h-[360px] overflow-hidden rounded-xl bg-slate-100 sm:h-[460px]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${activeImage || pickImage(property)})` }} />
              <button
                type="button"
                onClick={() => {
                  const index = gallery.indexOf(activeImage);
                  const next = index <= 0 ? gallery.length - 1 : index - 1;
                  setActiveImage(gallery[next] || activeImage);
                }}
                className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const index = gallery.indexOf(activeImage);
                  const next = index >= gallery.length - 1 ? 0 : index + 1;
                  setActiveImage(gallery[next] || activeImage);
                }}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {gallery.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className={`h-16 overflow-hidden rounded-lg border ${activeImage === url ? 'border-red-500' : 'border-slate-200'}`}
                >
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold text-white ${statusClass(property.status)}`}>
              {pretty(property.status)}
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-slate-900">{property.title}</h1>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {location}
            </p>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Starting From</p>
              <p className="mt-1 text-4xl font-bold text-red-600">{formatKES(property.price)}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-4">
                <div>
                  <p className="text-slate-500">Plot Size</p>
                  <p className="font-semibold text-slate-800">{plotSize}</p>
                </div>
                <div>
                  <p className="text-slate-500">Property Code</p>
                  <p className="font-semibold text-slate-800">{property.slug.toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setVisitFeedback(null);
                  if (!visitForm.visitDate) {
                    const suggestedDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    const localValue = new Date(suggestedDate.getTime() - suggestedDate.getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 10);

                    setVisitForm((prev) => ({ ...prev, visitDate: localValue }));
                  }
                  setShowVisitForm(true);
                }}
                className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Book Site Visit
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hello, I am interested in ${property.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-md border border-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                WhatsApp Us
              </a>
            </div>
          </aside>
        </div>
      </section>

      {showVisitForm ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Book Site Visit</h3>
                <p className="text-sm text-slate-600">{property.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowVisitForm(false)}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form
              className="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault();
                setVisitFeedback(null);
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
