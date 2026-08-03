'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { BookSiteVisitButton } from '@/components/common/book-site-visit-button';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';
import { SiteFooter } from '@/components/layout/site-footer';
import { PropertyCard } from '@/components/property/property-card';
import { usePublicProperties } from '@/hooks/public/usePublicProperties';
import type { PropertyRecord, PropertyStatus } from '@/services/api/properties';

type ListingProperty = PropertyRecord & {
  featuredImage: string;
};

const heroImage =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80';

function formatKES(price: number | null | undefined) {
  if (!price) return 'Contact for price';
  return `KES ${new Intl.NumberFormat('en-KE').format(price)}`;
}

function getStatusTone(status: PropertyStatus) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-blue-600';
    case 'RESERVED':
      return 'bg-orange-500';
    case 'SOLD':
      return 'bg-red-500';
    case 'COMING_SOON':
      return 'bg-slate-800';
    default:
      return 'bg-slate-800';
  }
}

function getStatusLabel(status: PropertyStatus) {
  switch (status) {
    case 'COMING_SOON':
      return 'COMING SOON';
    default:
      return status;
  }
}

function formatAmenityLabel(raw: string) {
  switch (raw) {
    case 'TITLE_DEED':
      return 'Ready Title Deed';
    case 'WATER':
      return 'Water Available';
    case 'ELECTRICITY':
      return 'Electricity Available';
    case 'ROAD':
      return 'Road Access';
    default:
      return raw
        .toLowerCase()
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
  }
}

function deriveSize(property: ListingProperty, index: number) {
  if (property.plotSize?.trim()) return property.plotSize;
  if (property.areaSqft) return `${property.areaSqft} sqft`;
  return 'Size on request';
}

export default function PublicPropertiesPage() {
  const { data, loading, error } = usePublicProperties({ page: 1, limit: 100 });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const listings = useMemo<ListingProperty[]>(() => {
    return data.map((property) => ({
      ...property,
      featuredImage:
        (property.featuredImageId
          ? property.images.find((image) => image.id === property.featuredImageId)?.url
          : undefined) ||
        property.images?.[0]?.url ||
        heroImage,
    }));
  }, [data]);

  const filteredListings = listings;

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredListings.length / perPage));
  const pageWindowStart = Math.max(1, page - 2);
  const pageWindowEnd = Math.min(totalPages, pageWindowStart + 4);
  const visiblePageNumbers = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, index) => pageWindowStart + index);
  const paginatedListings = filteredListings.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7fb_45%,#eef3f9_100%)] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
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

          <BookSiteVisitButton className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 sm:inline-flex">
            <CalendarDays className="h-4 w-4" />
            Book Site Visit
          </BookSiteVisitButton>
          <MobileNavMenu currentPath="/properties" />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">Properties</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="transition hover:text-red-600">Home</Link>
            <span>›</span>
            <span className="text-slate-700">Properties</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">Total Properties: {listings.length}</p>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button type="button" onClick={() => setViewMode('grid')} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Grid2x2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setViewMode('list')} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
            Loading properties...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="mt-4 rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4' : 'space-y-4'}>
          {paginatedListings.map((property, index) => {
            const image = property.featuredImage || property.images?.[0]?.url || heroImage;
            const sizeLabel = deriveSize(property, index);
            const amenityLabels =
              property.amenities?.length > 0
                ? property.amenities.map((amenity) => formatAmenityLabel(amenity.name))
                : [];

            return (
              <div key={property.id} className={viewMode === 'list' ? 'md:max-w-[760px]' : ''}>
                <PropertyCard
                  title={property.title}
                  slug={property.slug}
                  location={property.town || property.location || 'Prime Location'}
                  county={property.county}
                  price={property.price}
                  size={sizeLabel}
                  status={property.status}
                  featuredImage={image}
                  amenities={amenityLabels}
                  featured={property.featured}
                />
              </div>
            );
          })}
        </div>

        {listings.length === 0 && !loading ? (
          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">No properties available yet.</p>
            <p className="mt-2 text-sm text-slate-500">Check back soon for new listings.</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="inline-flex h-9 min-w-16 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1">Prev</span>
          </button>

          {visiblePageNumbers.map((item) => (
            <button key={item} onClick={() => setPage(item)} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-semibold shadow-sm transition ${page === item ? 'border-red-600 bg-red-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              {item}
            </button>
          ))}

          <button
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            className="inline-flex h-9 min-w-16 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next page"
            disabled={page === totalPages}
          >
            <span className="mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <p className="w-full text-center text-xs font-medium text-slate-500">
            Page {page} of {totalPages}
          </p>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] lg:grid-cols-[0.9fr_1.1fr_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <SlidersHorizontal className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Don’t find what you’re looking for?</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Let us help you find the perfect land that meets your needs and budget.</p>
            </div>
          </div>

          <div className="hidden rounded-[1.5rem] bg-[linear-gradient(90deg,rgba(37,99,235,0.08),rgba(220,38,38,0.04))] p-4 lg:block">
            <p className="text-sm font-medium text-slate-700">Speak to our land experts for a tailored recommendation, title verification, and site visit support.</p>
          </div>

          <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
            <CalendarDays className="h-4 w-4" />
            Contact Us
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
