import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Facebook,
  MapPin,
  Quote,
  Star,
} from 'lucide-react';
import { BookSiteVisitButton } from '@/components/common/book-site-visit-button';
import { ContactTickerBar } from '@/components/layout/contact-ticker-bar';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';
import { SiteFooter } from '@/components/layout/site-footer';

const heroImage =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80';

type Testimonial = {
  name: string;
  location: string;
  role: string;
  quote: string;
  profileImage: string;
};

const testimonialCards: Testimonial[] = [
  {
    name: 'James Mwangi',
    location: 'Nairobi, Kenya',
    role: 'Verified Buyer',
    quote:
      'Erimu Ventures made the entire process of buying land so simple and transparent. The team was professional and the property is exactly as they described.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Mary Wanjiku',
    location: 'Machakos, Kenya',
    role: 'Verified Buyer',
    quote:
      'The site visit experience was amazing. I got to see the land, ask questions and make an informed decision. I highly recommend Erimu Ventures.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'David Ochieng',
    location: 'Kisumu, Kenya',
    role: 'Verified Buyer',
    quote:
      'I was impressed with their transparency and commitment. The title deed process was smooth and I received my documents on time.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Grace Akinyi',
    location: 'Nakuru, Kenya',
    role: 'Verified Buyer',
    quote:
      'Affordable payment plans made it possible for me to own land without financial strain. Thank you Erimu Ventures for making my dream a reality!',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
];

const stats = [
  { value: '500+', label: 'Happy Clients' },
  { value: '1000+', label: 'Plots Sold' },
  { value: '10+', label: 'Strategic Locations' },
  { value: '98%', label: 'Customer Satisfaction' },
];

export default function TestimonialsPage() {
  return (
    <main className="bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/erimuventures%20logo%20updated.png"
              alt="Erimu Ventures"
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
            <Link href="/gallery" className="transition hover:text-red-600">Gallery</Link>
            <Link href="/testimonials" className="text-red-600">Testimonials</Link>
            <Link href="/contact" className="transition hover:text-red-600">Contact Us</Link>
          </nav>

          <BookSiteVisitButton className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 sm:inline-flex">
            <CalendarDays className="h-4 w-4" />
            Book Site Visit
          </BookSiteVisitButton>
          <MobileNavMenu currentPath="/testimonials" />
        </div>
      </header>

      <ContactTickerBar />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.84) 38%, rgba(255,255,255,0.2) 100%), url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.13),transparent_35%)]" />

        <div className="relative mx-auto min-h-[390px] max-w-7xl px-4 py-8 sm:min-h-[470px] sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="grid items-end gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Testimonials</p>
              <h1 className="mt-4 font-[family-name:var(--font-home-serif)] text-4xl font-bold leading-[0.96] tracking-[-0.04em] text-slate-900 sm:text-6xl lg:text-[4.45rem]">
                What Our Clients
                <br />
                Say <span className="text-red-600">About Us</span>
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-700 sm:text-lg">
                We take pride in helping hundreds of Kenyans achieve their dream of land ownership. Here&apos;s what some of our happy clients have to say.
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/92 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-slate-100 bg-white px-4 py-4 text-center shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                    <p className="text-3xl font-bold tracking-[-0.03em] text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <button
              type="button"
              className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-red-600 shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition hover:bg-slate-50 lg:inline-flex"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-red-600 shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition hover:bg-slate-50 lg:inline-flex"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
              {testimonialCards.map((item) => (
                <article key={item.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.07)]">
                  <div className="p-4 sm:p-5">
                    <Quote className="h-6 w-6 text-red-600" />
                    <p className="mt-3 text-sm leading-7 text-slate-700">{item.quote}</p>
                    <div className="mt-4 flex gap-1 text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>

                    <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <div
                        className="h-14 w-14 rounded-full border border-slate-200 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.profileImage})` }}
                      />
                      <div>
                        <p className="text-base font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.location}</p>
                        <p className="mt-1 text-xs font-semibold text-red-600">{item.role}</p>
                      </div>
                    </div>
                  </div>

                </article>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 shadow-[0_14px_34px_rgba(15,23,42,0.06)] lg:grid-cols-[1.1fr_0.6fr_0.4fr] lg:items-center">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Quote className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-3xl">Thousands of Kenyans Trust Erimu Ventures</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">We are committed to providing genuine, affordable and secure land ownership opportunities across Kenya.</p>
            </div>
          </div>

          <div className="text-center lg:border-l lg:border-slate-200 lg:pl-6">
            <div className="mx-auto mb-1 flex w-fit gap-1 text-amber-400">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-4xl font-bold tracking-[-0.03em] text-slate-900">4.9/5</p>
            <p className="mt-1 text-xs text-slate-500">Based on 300+ Reviews</p>
          </div>

          <div className="flex items-center justify-center gap-4 lg:border-l lg:border-slate-200 lg:pl-6">
            <span className="text-3xl font-semibold tracking-[-0.03em] text-blue-600 sm:text-4xl">Google</span>
            <Facebook className="h-9 w-9 text-blue-600" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 overflow-hidden rounded-2xl bg-[linear-gradient(90deg,#0f1e4a_0%,#1a2f67_52%,#0f1a3d_100%)] px-6 py-7 text-white shadow-[0_20px_46px_rgba(15,23,42,0.25)] lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-600 shadow-[0_8px_22px_rgba(15,23,42,0.2)]">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Ready to join our happy landowners?</h3>
              <p className="mt-1 text-sm text-white/80">Find your perfect plot today and take the first step towards owning your dream land.</p>
            </div>
          </div>

          <Link href="/properties" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.25)] transition hover:bg-red-700 sm:w-auto">
            Browse Properties <ArrowRight className="h-4 w-4" />
          </Link>
          <BookSiteVisitButton className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/40 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-slate-100 sm:w-auto">
            Book a Site Visit <CalendarDays className="h-4 w-4" />
          </BookSiteVisitButton>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}