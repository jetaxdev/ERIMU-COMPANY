'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Compass,
  FileText,
  Heart,
  Home,
  Landmark,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  StarHalf,
  Users2,
  Wallet,
} from 'lucide-react';
import { BookSiteVisitButton } from '@/components/common/book-site-visit-button';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';
import { SiteFooter } from '@/components/layout/site-footer';
import { usePublicProperties } from '@/hooks/public/usePublicProperties';
import { GalleryRecord, getGallery } from '@/services/api/gallery';
import type { PropertyRecord, PropertyStatus } from '@/services/api/properties';

const brandSans = Manrope({ subsets: ['latin'], variable: '--font-home-sans' });
const brandSerif = Cormorant_Garamond({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-home-serif' });

const heroImage =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80';

const services = [
  {
    icon: Home,
    title: 'Land Selling',
    description: 'Prime plots in strategic locations across fast-growing corridors.',
  },
  {
    icon: CalendarDays,
    title: 'Site Visits',
    description: 'Book guided visits with our team and inspect each location first-hand.',
  },
  {
    icon: BadgeCheck,
    title: 'Land Verification',
    description: 'We verify documents and ownership details before you commit.',
  },
  {
    icon: Wallet,
    title: 'Payment Plans',
    description: 'Flexible installment options designed to fit real buyers.',
  },
  {
    icon: FileText,
    title: 'Title Processing',
    description: 'End-to-end support to keep your title deed process moving.',
  },
];

const highlights = [
  { label: 'Prime Locations', description: 'Strategic locations with high value appreciation', icon: MapPin },
  { label: 'Secure Ownership', description: 'Genuine title deeds and transparent processes', icon: ShieldCheck },
  { label: 'Affordable Prices', description: 'Competitive plots with flexible payment plans', icon: Heart },
  { label: 'Excellent Support', description: 'Dedicated support from our experienced team', icon: PhoneCall },
];

const stats = [
  { value: '500+', label: 'Happy Clients', icon: Users2 },
  { value: '1000+', label: 'Plots Sold', icon: Landmark },
  { value: '10+', label: 'Strategic Locations', icon: Compass },
  { value: '5+', label: 'Years Experience', icon: Sparkles },
  { value: '100%', label: 'Customer Satisfaction', icon: CircleCheck },
];

const testimonials = [
  {
    quote: 'Erimu Ventures made my land buying experience smooth and stress-free. The team is professional and trustworthy.',
    author: 'John Mwangi',
    place: 'Nairobi',
  },
  {
    quote: 'I got my title deed within the promised time. They truly value their customers and deliver as promised.',
    author: 'Mary Wanjiku',
    place: 'Kiambu',
  },
  {
    quote: 'Best investment decision I ever made. The value of my land has already appreciated.',
    author: 'Peter Otieno',
    place: 'Machakos',
  },
];

const processSteps = [
  {
    title: 'Search & Choose',
    description: 'Browse our available properties and select your preferred plot.',
    icon: Compass,
  },
  {
    title: 'Site Visit',
    description: 'Book a site visit and inspect the property with our team.',
    icon: CalendarDays,
  },
  {
    title: 'Make Payment',
    description: 'Choose a payment plan and complete your purchase securely.',
    icon: Wallet,
  },
  {
    title: 'Get Your Title Deed',
    description: 'We process your documents and guide you until title handover.',
    icon: FileText,
  },
];

function formatPrice(price: number | null) {
  if (!price) return 'Contact for price';
  return `KES ${new Intl.NumberFormat('en-KE').format(price)}`;
}

function statusLabel(status: PropertyStatus) {
  switch (status) {
    case 'AVAILABLE':
      return 'AVAILABLE';
    case 'SOLD':
      return 'SOLD';
    case 'RESERVED':
      return 'RESERVED';
    case 'COMING_SOON':
      return 'COMING SOON';
    default:
      return status;
  }
}

function getStatusClass(status: PropertyStatus) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-blue-600';
    case 'SOLD':
      return 'bg-red-500';
    case 'RESERVED':
      return 'bg-orange-500';
    case 'COMING_SOON':
      return 'bg-slate-700';
    default:
      return 'bg-slate-700';
  }
}

export default function HomePage() {
  const { data, loading } = usePublicProperties({ page: 1, limit: 100 });
  const [galleryItems, setGalleryItems] = useState<GalleryRecord[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getGallery()
      .then((result) => {
        if (!mounted) {
          return;
        }

        setGalleryItems(result.data);
        setGalleryLoading(false);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setGalleryItems([]);
        setGalleryLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const featuredProperties = data
    .slice()
    .sort((left, right) => Number(right.featured) - Number(left.featured))
    .slice(0, 4)
    .map((property: PropertyRecord) => {
      const preferredImage =
        (property.featuredImageId
          ? property.images.find((image) => image.id === property.featuredImageId)?.url
          : undefined) || property.images?.[0]?.url;

      return {
        ...property,
        featuredImage: preferredImage || heroImage,
        size: property.plotSize || (property.areaSqft ? `${property.areaSqft} sqft` : 'Size on request'),
        highlight: property.location || property.county || 'Prime investment opportunity',
      };
    });

  const homepageGalleryItems = useMemo(
    () =>
      galleryItems
        .slice()
        .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title))
        .slice(0, 3),
    [galleryItems],
  );

  const scrollingGalleryItems = useMemo(
    () => [...homepageGalleryItems, ...homepageGalleryItems],
    [homepageGalleryItems],
  );

  return (
    <main className={`${brandSans.variable} ${brandSerif.variable} bg-white font-[family-name:var(--font-home-sans)] text-slate-900`}>
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/erimuventures%20logo%20updated.png"
              alt="Erimu Ventures"
              width={140}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            <Link href="/" className="text-red-600">
              Home
            </Link>
            <Link href="/properties" className="transition hover:text-red-600">
              Properties
            </Link>
            <Link href="/about" className="transition hover:text-red-600">
              About Us
            </Link>
            <Link href="/services" className="transition hover:text-red-600">
              Services
            </Link>
            <Link href="/gallery" className="transition hover:text-red-600">
              Gallery
            </Link>
            <Link href="/testimonials" className="transition hover:text-red-600">
              Testimonials
            </Link>
            <Link href="/contact" className="transition hover:text-red-600">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <BookSiteVisitButton className="hidden rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:inline-flex">
              Book Site Visit
            </BookSiteVisitButton>
            <Link
              href="/properties"
              className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.28)] transition hover:bg-red-700 sm:inline-flex"
            >
              View Properties <ArrowRight className="h-4 w-4" />
            </Link>
            <MobileNavMenu currentPath="/" />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(3,11,27,0.82) 0%, rgba(3,11,27,0.55) 45%, rgba(3,11,27,0.15) 100%), url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.3),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.26),transparent_28%)]" />

        <div className="relative mx-auto flex min-h-[820px] max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid items-start gap-10 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:pt-14">
            <div className="max-w-3xl text-white">
              <h1 className="max-w-2xl font-[family-name:var(--font-home-serif)] text-5xl font-bold leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-[4.7rem]">
                Own Prime Land
                <br />
                With Confidence
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/86 sm:text-lg">
                Erimu Ventures Limited connects you with verified investment plots across Kenya. Transparent pricing, secure ownership, and exceptional customer service.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="#properties" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.34)] transition hover:bg-red-700">
                  View Available Plots <ArrowRight className="h-4 w-4" />
                </Link>
                <BookSiteVisitButton className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.3)] transition hover:bg-blue-700">
                  Book a Site Visit <ArrowRight className="h-4 w-4" />
                </BookSiteVisitButton>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/12 bg-black/60 px-5 py-4 text-white shadow-[0_18px_36px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-white/75">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="properties" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Featured Properties</p>
            <h2 className="mt-3 font-[family-name:var(--font-home-serif)] text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
              Our Prime Land Investments
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Discover our handpicked selection of prime plots in strategic locations.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProperties.map((property) => (
              <article key={property.id} className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.36)), url(${property.featuredImage})`,
                    }}
                  />
                  <span className={`absolute left-3 top-3 rounded-md px-3 py-1 text-[11px] font-bold text-white ${getStatusClass(property.status)}`}>
                    {statusLabel(property.status)}
                  </span>
                  <button type="button" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:text-red-600">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{property.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location || property.county || 'Prime location'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <BadgeCheck className="h-4 w-4 text-slate-400" />
                      {property.size}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400" />
                      Verified
                    </span>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">{property.highlight}</p>
                  <p className="text-xl font-bold text-blue-700">{formatPrice(property.price)}</p>
                  <Link href={`/properties/${property.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {!loading && featuredProperties.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-500">No featured properties are available yet. Check back after the admin publishes listings.</p>
          ) : null}

          {loading ? <p className="mt-4 text-center text-sm text-slate-500">Loading live featured properties...</p> : null}
        </div>
      </section>

      <section id="gallery" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Gallery</p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-slate-900">Latest Highlights From Our Gallery</h2>
          </div>

          {homepageGalleryItems.length > 0 ? (
            <div className="relative mt-10 overflow-hidden rounded-[1.75rem]">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

              <div className="home-gallery-marquee-track flex w-max gap-5">
                {scrollingGalleryItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="relative w-[320px] shrink-0 overflow-hidden rounded-[1.75rem] bg-slate-900 shadow-[0_16px_34px_rgba(15,23,42,0.1)]">
                    <div
                      className="h-80 bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.56)), url(${item.mediaType === 'VIDEO' ? item.thumbnailUrl || item.mediaUrl : item.mediaUrl})`,
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/80">0{(index % homepageGalleryItems.length) + 1}</p>
                      <p className="mt-1 text-lg font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/75">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!galleryLoading && homepageGalleryItems.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-500">No gallery items are available yet. Add items from the admin gallery to show them here.</p>
          ) : null}

          {galleryLoading ? <p className="mt-6 text-center text-sm text-slate-500">Loading gallery highlights...</p> : null}
        </div>
      </section>

      <style jsx global>{`
        @keyframes home-gallery-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .home-gallery-marquee-track {
          animation: home-gallery-marquee 30s linear infinite;
        }

        .home-gallery-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section id="services" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Our Services</p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-slate-900">What We Offer</h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="rounded-2xl border border-slate-200 bg-white px-5 py-7 text-center shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.1)]">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(90deg,#0d1a4d_0%,#102e74_45%,#08153d_100%)] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-center backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/75">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="testimonials" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Testimonials</p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-slate-900">What Our Clients Say</h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.author} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                <div className="text-5xl leading-none text-blue-600">“</div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{testimonial.quote}</p>
                <div className="mt-5 flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <StarHalf className="h-4 w-4 fill-current" />
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.place}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Our Process</p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-slate-900">Simple Steps To Own Your Dream Land</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${index % 2 === 0 ? 'bg-blue-600' : 'bg-red-600'} text-white`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">{index + 1}</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                  {index < processSteps.length - 1 ? <div className="mx-auto mt-6 hidden h-px w-full bg-slate-200 xl:block" /> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-[2rem] bg-[linear-gradient(90deg,#11328a_0%,#244fb7_48%,#0a1126_100%)] text-white lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 px-8 py-10 lg:px-10 lg:py-12">
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">Ready to Invest in Your Future?</h2>
            <p className="max-w-xl text-base leading-7 text-white/82">
              Contact us today and let us help you find the perfect land investment opportunity.
            </p>
            <Link href="/contact#contact-form" className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Contact Us Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-[260px] bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.45))]" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <h3 className="text-2xl font-semibold">Book a Site Visit Today</h3>
                <p className="mt-2 max-w-sm text-sm text-white/80">See the land, feel the potential, and make the right investment decision.</p>
              </div>
              <BookSiteVisitButton className="inline-flex rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
                Book Site Visit
              </BookSiteVisitButton>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
