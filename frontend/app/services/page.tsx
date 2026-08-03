import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileText,
  Heart,
  Home,
  Landmark,
  MapPin,
  PhoneCall,
  Plus,
  ShieldCheck,
  Users2,
  Wallet,
} from 'lucide-react';
import { BookSiteVisitButton } from '@/components/common/book-site-visit-button';
import { ContactTickerBar } from '@/components/layout/contact-ticker-bar';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';
import { SiteFooter } from '@/components/layout/site-footer';

const heroImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80';
const ctaImage = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80';

const services = [
  {
    icon: Home,
    title: 'Land Selling',
    description: 'Carefully selected plots in strategic locations with verified ownership and clear documentation.',
    accent: 'bg-rose-50 text-rose-600',
  },
  {
    icon: MapPin,
    title: 'Guided Site Visits',
    description: 'Book a visit and explore each property with our team before you make a decision.',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BadgeCheck,
    title: 'Land Verification',
    description: 'We confirm ownership records, approvals, and property details before purchase.',
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: FileText,
    title: 'Title Deed Processing',
    description: 'We assist buyers through the title transfer process and document preparation.',
    accent: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Wallet,
    title: 'Flexible Payment Plans',
    description: 'Installment options designed to make ownership accessible without compromising security.',
    accent: 'bg-violet-50 text-violet-600',
  },
  {
    icon: PhoneCall,
    title: 'Customer Support',
    description: 'Dedicated support through the entire journey, from inquiry to ownership.',
    accent: 'bg-rose-50 text-rose-500',
  },
];

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Verified Properties',
    description: 'All our properties are legally verified for your peace of mind.',
  },
  {
    icon: Heart,
    title: 'Transparent Pricing',
    description: 'No hidden charges. What you see is what you pay.',
  },
  {
    icon: Landmark,
    title: 'Strategic Locations',
    description: 'Our lands are in fast-growing areas with strong ROI potential.',
  },
  {
    icon: Users2,
    title: 'Professional Support',
    description: 'We walk with you every step of the way, from inquiry to ownership.',
  },
];

const steps = [
  {
    icon: MapPin,
    title: 'Choose Property',
    description: 'Browse our available properties and select the one that suits you.',
  },
  {
    icon: CalendarDays,
    title: 'Book Site Visit',
    description: 'Schedule a visit and inspect the land with our team on the ground.',
  },
  {
    icon: FileText,
    title: 'Verify Documents',
    description: 'We verify all documents to ensure the land is 100% genuine.',
  },
  {
    icon: Wallet,
    title: 'Complete Payment',
    description: 'Choose a payment plan that works for you and complete payment.',
  },
  {
    icon: BadgeCheck,
    title: 'Receive Title Deed',
    description: 'We process the transfer and you receive your title deed.',
  },
];

const stats = [
  { value: '500+', label: 'Happy Clients', icon: Users2 },
  { value: '1000+', label: 'Plots Sold', icon: Landmark },
  { value: '10+', label: 'Strategic Locations', icon: MapPin },
  { value: '98%', label: 'Customer Satisfaction', icon: CheckCircle2 },
];

const faqs = [
  {
    question: 'Can I pay for the land in installments?',
    answer:
      'Yes. We offer flexible installment plans depending on the property and payment period. Our team shares the available plan options, deposit requirements, and schedule before you commit.',
  },
  {
    question: 'Are all properties verified?',
    answer:
      'Yes. We verify ownership records and key land documents before listing any property. You are also guided through due diligence so you can buy with confidence.',
  },
  {
    question: 'Can I book a site visit online?',
    answer:
      'Yes. You can book a site visit directly from the website using the Book Site Visit button. Once submitted, our team confirms your preferred date and visit details.',
  },
  {
    question: 'What documents do I receive after purchase?',
    answer:
      'After purchase, you receive the relevant sale documentation and transfer paperwork, and we guide you through title deed processing to completion based on the transaction stage.',
  },
  {
    question: 'How long does the title transfer take?',
    answer:
      'Transfer timelines vary depending on the property and registry process, but we provide clear step-by-step updates and support throughout until the transfer is finalized.',
  },
  {
    question: 'Do you charge hidden fees?',
    answer:
      'No. Our pricing is transparent, and all expected costs are explained upfront before payment so you know exactly what you are paying for.',
  },
];

export default function ServicesPage() {
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
            <Link href="/services" className="text-red-600">Services</Link>
            <Link href="/gallery" className="transition hover:text-red-600">Gallery</Link>
            <Link href="/testimonials" className="transition hover:text-red-600">Testimonials</Link>
            <Link href="/contact" className="transition hover:text-red-600">Contact Us</Link>
          </nav>

          <BookSiteVisitButton className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 sm:inline-flex">
            <CalendarDays className="h-4 w-4" />
            Book Site Visit
          </BookSiteVisitButton>
          <MobileNavMenu currentPath="/services" />
        </div>
      </header>

      <ContactTickerBar />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.84) 38%, rgba(255,255,255,0.2) 100%), url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.12),transparent_28%)]" />

        <div className="relative mx-auto min-h-[440px] max-w-7xl px-4 py-8 sm:min-h-[560px] sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="flex items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Our Services</p>
              <h1 className="mt-4 font-[family-name:var(--font-home-serif)] text-[2.35rem] font-bold leading-[0.98] tracking-[-0.04em] text-slate-900 sm:text-6xl lg:text-[4.75rem]">
                Making Land Ownership
                <br />
                Simple, <span className="text-red-600">Secure &amp; Affordable</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
                We provide verified land investment opportunities with flexible payment options and professional guidance.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/properties" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.28)] transition hover:bg-red-700 sm:w-auto">
                  View Properties <ArrowRight className="h-4 w-4" />
                </Link>
                <BookSiteVisitButton className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:bg-slate-50 sm:w-auto">
                  Book Site Visit <CalendarDays className="h-4 w-4" />
                </BookSiteVisitButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">What We Offer</p>
            <h2 className="mt-3 font-[family-name:var(--font-home-serif)] text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">Our Services</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${service.accent}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Why Choose Us</p>
            <h2 className="mt-3 font-[family-name:var(--font-home-serif)] text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">Why Choose Erimu Ventures</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <article key={reason.title} className="rounded-[1.6rem] bg-white p-5 sm:p-6 text-center shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{reason.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">How It Works</p>
            <h2 className="mt-3 font-[family-name:var(--font-home-serif)] text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">Simple Steps to Own Land</h2>
          </div>

          <div className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="relative rounded-3xl border border-slate-200 bg-white px-5 pb-6 pt-8 text-center shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
                  <div className="absolute left-1/2 top-[-16px] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white shadow-[0_10px_24px_rgba(220,38,38,0.3)]">
                    {index + 1}
                  </div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-red-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 rounded-[1.75rem] bg-[linear-gradient(90deg,#102463_0%,#18338d_48%,#0f214f_100%)] px-5 py-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:px-8 sm:py-8 xl:grid-cols-4 xl:gap-0">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center border-white/10 px-2 text-center xl:border-r xl:px-6 last:xl:border-r-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-4xl font-bold tracking-[-0.03em]">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold">{stat.label}</p>
                <p className="mt-1 max-w-48 text-xs leading-5 text-white/70">{stat.label === 'Customer Satisfaction' ? 'Our clients recommend us to others' : stat.label === 'Happy Clients' ? 'Families who have invested with us' : stat.label === 'Plots Sold' ? 'Successful land transactions' : 'Prime areas across Kenya'}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Frequently Asked Questions</p>
            <h2 className="mt-3 font-[family-name:var(--font-home-serif)] text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">Your Questions, Answered</h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-800 marker:hidden">
                  <span>{faq.question}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-open:rotate-45">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-0 overflow-hidden rounded-[1.8rem] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[220px] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(15,23,42,0.42)), url(${ctaImage})` }}>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.22),rgba(255,255,255,0.02))]" />
            <div className="absolute inset-0 flex items-center px-6 py-7 sm:px-8">
              <div className="flex items-center gap-4 rounded-3xl bg-white/90 px-5 py-4 shadow-[0_18px_44px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Home className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">Ready To Invest In Your Future?</h3>
                  <p className="mt-1 text-sm text-slate-600">Find the perfect plot and start your journey towards land ownership today.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center gap-4 bg-white px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-center lg:gap-5">
            <Link href="/properties" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.28)] transition hover:bg-red-700 sm:w-auto">
              Browse Properties <ArrowRight className="h-4 w-4" />
            </Link>
            <BookSiteVisitButton className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:bg-slate-50 sm:w-auto">
              Book Site Visit <CalendarDays className="h-4 w-4" />
            </BookSiteVisitButton>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}