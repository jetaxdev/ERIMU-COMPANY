'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  Construction,
  Images,
  PlayCircle,
  TreePine,
  Video,
} from 'lucide-react';
import { BookSiteVisitButton } from '@/components/common/book-site-visit-button';
import { ContactTickerBar } from '@/components/layout/contact-ticker-bar';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';
import { SiteFooter } from '@/components/layout/site-footer';
import { GalleryRecord, getGallery } from '@/services/api/gallery';

const heroImage =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80';

type GalleryCategory = 'All' | 'Videos' | string;

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryRecord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    getGallery()
      .then((result) => {
        if (!mounted) {
          return;
        }

        setGalleryItems(result.data);
        setCategories(result.categories);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setError('Gallery content is unavailable right now.');
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const galleryTabs = useMemo(() => {
    const uniqueCategories = [...new Set(categories)].filter(Boolean);

    return [
      { label: 'All', icon: Images },
      ...uniqueCategories.map((category) => ({ label: category, icon: categoryIcon(category) })),
      { label: 'Videos', icon: Video },
    ] as const;
  }, [categories]);

  const filteredItems = useMemo(() => {
    const items = galleryItems
      .slice()
      .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title));

    if (activeCategory === 'All') {
      return items;
    }

    if (activeCategory === 'Videos') {
      return items.filter((item) => item.mediaType === 'VIDEO');
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, galleryItems]);

  const videoItems = useMemo(
    () =>
      galleryItems
        .filter((item) => item.mediaType === 'VIDEO')
        .slice()
        .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title)),
    [galleryItems],
  );

  return (
    <main className="bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/erimuland%20logo.png"
              alt="Erimu Land Ltd"
              width={140}
              height={48}
              className="h-10 w-auto object-contain sm:h-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            <Link href="/" className="transition hover:text-red-600">Home</Link>
            <Link href="/properties" className="transition hover:text-red-600">Properties</Link>
            <Link href="/about" className="transition hover:text-red-600">About Us</Link>
            <Link href="/services" className="transition hover:text-red-600">Services</Link>
            <Link href="/gallery" className="text-red-600">Gallery</Link>
            <Link href="/testimonials" className="transition hover:text-red-600">Testimonials</Link>
            <Link href="/contact" className="transition hover:text-red-600">Contact Us</Link>
          </nav>

          <BookSiteVisitButton className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 sm:inline-flex">
            <CalendarDays className="h-4 w-4" />
            Book Site Visit
          </BookSiteVisitButton>
          <MobileNavMenu currentPath="/gallery" />
        </div>
      </header>

      <ContactTickerBar />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 38%, rgba(255,255,255,0.2) 100%), url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.13),transparent_35%)]" />

        <div className="relative mx-auto min-h-[390px] max-w-7xl px-4 py-8 sm:min-h-[460px] sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="flex items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Gallery</p>
              <h1 className="mt-4 font-[family-name:var(--font-home-serif)] text-[2.35rem] font-bold leading-[0.95] tracking-[-0.04em] text-slate-900 sm:text-6xl lg:text-[4.7rem]">
                Explore Our Property
                <br />
                <span className="text-red-600">Gallery</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
                Browse photos and videos of our available plots, completed developments, successful handovers, and memorable site visits.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/properties" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.28)] transition hover:bg-red-700 sm:w-auto">
                  Browse Properties <ArrowRight className="h-4 w-4" />
                </Link>
                <BookSiteVisitButton className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:bg-slate-50 sm:w-auto">
                  Book Site Visit <CalendarDays className="h-4 w-4" />
                </BookSiteVisitButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {galleryTabs.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.label;

              return (
                <button
                  key={category.label}
                  type="button"
                  onClick={() => setActiveCategory(category.label)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'border-red-600 bg-red-600 text-white shadow-[0_10px_24px_rgba(220,38,38,0.28)]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <article key={item.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <div className="relative">
                  <div
                    className="h-40 bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.1), rgba(15,23,42,0.2)), url(${item.mediaType === 'VIDEO' ? item.thumbnailUrl || item.mediaUrl : item.mediaUrl})`,
                    }}
                  />
                  {item.mediaType === 'VIDEO' ? (
                    <button type="button" className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-[0_12px_28px_rgba(15,23,42,0.25)] transition group-hover:scale-105" aria-label={`Play ${item.title}`}>
                      <PlayCircle className="h-6 w-6" />
                    </button>
                  ) : null}
                  <span className="absolute left-3 top-3 rounded-full bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {item.category}
                  </span>
                  {item.mediaType === 'VIDEO' && item.duration ? (
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">{item.duration}</span>
                  ) : null}
                </div>
                <div className="space-y-1 px-3 py-2.5 sm:px-3.5">
                  <p className="text-sm font-semibold leading-6 text-slate-900">{item.title}</p>
                  {item.description ? <p className="text-xs leading-5 text-slate-500">{item.description}</p> : null}
                </div>
              </article>
            ))}
          </div>

          {!loading && filteredItems.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No gallery items are available in this category yet.</p>
          ) : null}

          {error ? <p className="mt-6 text-sm text-rose-600">{error}</p> : null}

          <div className="mt-10 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-900 sm:text-3xl">Featured Videos</h2>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {videoItems.map((video) => (
              <article key={video.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <div className="relative">
                  <div
                    className="h-36 bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.45)), url(${video.thumbnailUrl || video.mediaUrl})` }}
                  />
                  <button type="button" className="absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-[0_12px_28px_rgba(15,23,42,0.25)] transition group-hover:scale-105" aria-label={`Play ${video.title}`}>
                    <PlayCircle className="h-7 w-7" />
                  </button>
                  {video.duration ? <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">{video.duration}</span> : null}
                </div>
                <div className="space-y-1 px-3 py-2.5 sm:px-3.5">
                  <p className="text-sm font-semibold leading-6 text-slate-900">{video.title}</p>
                  {video.description ? <p className="text-xs leading-5 text-slate-500">{video.description}</p> : null}
                </div>
              </article>
            ))}
          </div>

          {!loading && videoItems.length === 0 ? <p className="mt-4 text-sm text-slate-500">No videos have been added yet.</p> : null}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] lg:grid-cols-[1.2fr_auto_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Ready to see the property in person?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">Book a free site visit with our team and take the first step towards owning your dream land.</p>
            </div>
          </div>

          <BookSiteVisitButton className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 sm:w-auto">
            Book Site Visit
          </BookSiteVisitButton>
          <Link href="/properties" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-slate-100 sm:w-auto">
            Browse Properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function categoryIcon(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes('site')) return Camera;
  if (normalized.includes('deed')) return Building2;
  if (normalized.includes('develop') || normalized.includes('progress')) return Construction;
  if (normalized.includes('aerial') || normalized.includes('drone')) return TreePine;
  if (normalized.includes('video')) return Video;

  return Images;
}