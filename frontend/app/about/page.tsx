'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Compass,
  Heart,
  Landmark,
  Lightbulb,
  MapPin,
  PhoneCall,
  Shield,
  Sparkles,
  Users2,
} from 'lucide-react';
import { BookSiteVisitButton } from '@/components/common/book-site-visit-button';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';
import { SiteFooter } from '@/components/layout/site-footer';

const heroImage =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80';

const officeImage =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80';

const values = [
  { icon: Shield, label: 'Integrity', description: 'We do the right thing always.' },
  { icon: BadgeCheck, label: 'Transparency', description: 'Clear processes, no hidden fees.' },
  { icon: Lightbulb, label: 'Innovation', description: 'Modern solutions for modern needs.' },
  { icon: Heart, label: 'Commitment', description: 'Your satisfaction is our priority.' },
];

const stats = [
  { value: '500+', label: 'Happy Clients', sub: 'Families who have invested with us', icon: Users2 },
  { value: '1000+', label: 'Plots Sold', sub: 'Successful land transactions', icon: Landmark },
  { value: '10+', label: 'Strategic Locations', sub: 'Prime areas across Kenya', icon: MapPin },
  { value: '5+', label: 'Years Experience', sub: 'Delivering value and building trust', icon: Compass },
  { value: '98%', label: 'Client Satisfaction', sub: 'Our clients recommend us to others', icon: Sparkles },
];

const advantages = [
  {
    icon: BadgeCheck,
    title: 'Verified & Genuine Land',
    description: 'All our properties are legally verified for your peace of mind.',
  },
  {
    icon: Landmark,
    title: 'Flexible Payment Plans',
    description: 'We offer convenient payment options that fit your budget.',
  },
  {
    icon: MapPin,
    title: 'Strategic Locations',
    description: 'Our lands are located in high potential growth areas.',
  },
  {
    icon: PhoneCall,
    title: 'Excellent Customer Support',
    description: 'Our team is always ready to walk with you every step of the way.',
  },
];

const missionPoints = [
  '100% genuine and verified land',
  'Affordable payment plans',
  'Secure and hassle-free process',
  'Prime and fast-growing locations',
];

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
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
            <Link href="/about" className="text-red-600">About Us</Link>
            <Link href="/services" className="transition hover:text-red-600">Services</Link>
            <Link href="/gallery" className="transition hover:text-red-600">Gallery</Link>
            <Link href="/testimonials" className="transition hover:text-red-600">Testimonials</Link>
            <Link href="/contact" className="transition hover:text-red-600">Contact Us</Link>
          </nav>

          <BookSiteVisitButton
            className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 sm:inline-flex"
          >
            <CalendarDays className="h-4 w-4" />
            Book Site Visit
          </BookSiteVisitButton>
          <MobileNavMenu currentPath="/about" />
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[420px] overflow-hidden sm:min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(3,11,27,0.84) 0%, rgba(3,11,27,0.58) 45%, rgba(3,11,27,0.18) 100%), url(${heroImage})`,
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="text-white">
            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-[3.2rem]">
              Building More Than Properties,{' '}
              <span className="text-red-500">We Build<br />Trust &amp; Futures</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/82">
              Erimu Ventures Ltd is a land investment company committed to providing genuine, affordable, and high-value land opportunities across Kenya.
            </p>
            <BookSiteVisitButton
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.34)] transition hover:bg-red-700"
            >
              Book a Site Visit <ArrowRight className="h-4 w-4" />
            </BookSiteVisitButton>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
            <Image
              src={officeImage}
              alt="Erimu Ventures Office"
              width={900}
              height={600}
              className="h-80 w-full object-cover lg:h-[420px]"
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-600">Our Story</p>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-4xl">Our Journey So Far</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Erimu Ventures Ltd was founded with a simple goal — to make land ownership in Kenya accessible, transparent, and stress-free. We understand the dreams people have for their families, and we are here to turn those dreams into reality.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Through integrity, innovation, and exceptional customer service, we continue to be a trusted partner in land investment.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.label} className="text-center">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">{value.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[linear-gradient(90deg,#0d1a4d_0%,#102e74_45%,#08153d_100%)] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center gap-2 border-r border-white/10 px-4 text-center last:border-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="text-sm font-semibold">{stat.label}</p>
                <p className="text-xs leading-5 text-white/65">{stat.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MISSION + VISION + WHY CHOOSE US ── */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
          {/* Mission */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_34px_rgba(15,23,42,0.07)]">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-600">Our Mission</p>
            <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.03em] text-slate-900 sm:text-3xl">
              To Provide Affordable &amp; Genuine Land Ownership Opportunities
            </h2>
            <div className="my-5 h-px bg-red-100" />
            <p className="text-sm leading-7 text-slate-600">
              We exist to help every Kenyan own a piece of land in well-planned, secure, and fast-developing areas.
            </p>
            <ul className="mt-5 space-y-3">
              {missionPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Vision */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_34px_rgba(15,23,42,0.07)]">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-600">Our Vision</p>
            <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.03em] text-slate-900 sm:text-3xl">
              To Be Kenya&apos;s Most Trusted Land Investment Partner
            </h2>
            <div className="my-5 h-px bg-red-100" />
            <p className="text-sm leading-7 text-slate-600">
              We aim to set the standard for transparent, customer-first land investment by helping more families and investors build secure futures.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                'Trusted guidance at every step',
                'Transparent land transactions',
                'Long-term value for every client',
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Why choose us */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_34px_rgba(15,23,42,0.07)]">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-600">Why Choose Us</p>
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-3xl">
              The Erimu Ventures Advantage
            </h2>
            <div className="mt-6 space-y-4">
              {advantages.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_14px_34px_rgba(15,23,42,0.07)] sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ready to own your dream land?</h3>
              <p className="mt-1 text-sm text-slate-600">Let us help you take the first step towards a secure future.</p>
            </div>
          </div>
          <BookSiteVisitButton className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
            Book a Site Visit <ArrowRight className="h-4 w-4" />
          </BookSiteVisitButton>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
