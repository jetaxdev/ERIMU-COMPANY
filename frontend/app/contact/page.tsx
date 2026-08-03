'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Headphones,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BookSiteVisitButton } from '@/components/common/book-site-visit-button';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';
import { SiteFooter } from '@/components/layout/site-footer';
import { CompanyProfile, getCompanyProfile } from '@/services/api/company';
import { createInquiry } from '@/services/api/inquiries';

const heroImage =
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1800&q=80';

const fallbackPhones = ['+254 700 123 456', '+254 711 456 789'];
const fallbackEmails = ['info@erimuventures.co.ke', 'sales@erimuventures.co.ke'];
const fallbackAddress = 'KWFT Building, Kagio Town, Kirinyaga, Kenya';
const fallbackMapSrc = 'https://www.google.com/maps?q=KWFT%20Building%2C%20Kagio%20Town%2C%20Kirinyaga%2C%20Kenya&output=embed';

const supportCards = [
  {
    title: 'Quick Response',
    description: 'We value your time and respond to all inquiries promptly.',
    icon: Headphones,
    accent: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'Trusted Support',
    description: 'Our team is professional, friendly, and ready to assist you.',
    icon: ShieldCheck,
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Expert Guidance',
    description: 'We provide expert advice to help you make the right investment.',
    icon: Sparkles,
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Secure & Reliable',
    description: 'Your information is safe with us. We are committed to your privacy.',
    icon: Lock,
    accent: 'bg-violet-50 text-violet-600',
  },
];

export default function ContactPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    getCompanyProfile()
      .then((result) => setCompany(result))
      .catch(() => setCompany(null));
  }, []);

  const phones = useMemo(
    () => (company?.phones?.map((phone) => phone.trim()).filter(Boolean) ?? fallbackPhones),
    [company?.phones],
  );

  const emails = useMemo(
    () => (company?.emails?.map((email) => email.trim()).filter(Boolean) ?? fallbackEmails),
    [company?.emails],
  );

  const companyName = company?.name?.trim() || 'Erimu Ventures Ltd';
  const companyAddress = company?.address?.trim() || fallbackAddress;
  const companyAbout =
    company?.about?.trim() ||
    'We connect you with verified investment plots across Kenya. Transparent pricing, secure ownership, and exceptional customer service.';

  const primaryPhone = phones[0] || fallbackPhones[0];
  const primaryEmail = emails[0] || fallbackEmails[0];
  const whatsappPhone = primaryPhone.replace(/[^\d]/g, '');
  const mapSrc = fallbackMapSrc;

  function setFormField(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    setSubmitMessage('');

    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setSubmitError('Please fill in your full name, email address, and message.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await createInquiry({
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim(),
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      });

      if (result.emailSent) {
        setSubmitMessage('Your message has been sent successfully. Our team will contact you shortly.');
      } else {
        setSubmitMessage('Your inquiry was received and saved, but email delivery is pending. Our team can still view it in Admin Inquiries.');
      }

      setForm({
        fullName: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      setSubmitError('We could not send your message right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
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
            <Link href="/properties" className="transition hover:text-red-600">Properties</Link>
            <Link href="/about" className="transition hover:text-red-600">About Us</Link>
            <Link href="/services" className="transition hover:text-red-600">Services</Link>
            <Link href="/gallery" className="transition hover:text-red-600">Gallery</Link>
            <Link href="/testimonials" className="transition hover:text-red-600">Testimonials</Link>
            <Link href="/contact" className="text-red-600">Contact Us</Link>
          </nav>

          <BookSiteVisitButton
            className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 sm:inline-flex"
          >
            <CalendarDays className="h-4 w-4" />
            Book Site Visit
          </BookSiteVisitButton>
          <MobileNavMenu currentPath="/contact" />
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.18) 100%), url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.12),transparent_34%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Contact Us</p>
              <h1 className="mt-4 font-[family-name:var(--font-home-serif)] text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-slate-900 sm:text-6xl lg:text-[4.5rem]">
                We Are Here
                <br />
                To Help You
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-700 sm:text-lg">
                Have questions or ready to own your dream land? Reach out to us today and our team will be happy to assist you.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Call Us</p>
                    <p className="text-sm font-semibold text-slate-900">{primaryPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email Us</p>
                    <p className="text-sm font-semibold text-slate-900">{primaryEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">WhatsApp Us</p>
                    <p className="text-sm font-semibold text-slate-900">{primaryPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_56px_rgba(15,23,42,0.15)] backdrop-blur-sm sm:p-7">
              <h2 className="text-4xl font-semibold tracking-[-0.03em] text-slate-900">Send Us a Message</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Fill in the form below and we will get back to you as soon as possible.</p>

              <form id="contact-form" onSubmit={handleSendMessage} className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={(event) => setFormField('fullName', event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(event) => setFormField('phone', event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(event) => setFormField('email', event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(event) => setFormField('subject', event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <textarea
                  placeholder="Your Message"
                  rows={5}
                  value={form.message}
                  onChange={(event) => setFormField('message', event.target.value)}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
                />

                {submitError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p> : null}
                {submitMessage ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{submitMessage}</p> : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                >
                  {submitting ? 'Sending...' : 'Send Message'} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {supportCards.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Get In Touch</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-slate-900">Our Contact Information</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Our Office</p>
                  <p className="text-sm text-slate-600">{companyAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Phone</p>
                  <p className="text-sm text-slate-600">{phones.join(', ')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <p className="text-sm text-slate-600">{emails.join(', ')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Working Hours</p>
                  <p className="text-sm text-slate-600">Mon - Sat: 8:00 AM - 6:00 PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <iframe
                title={`${companyName} Location`}
                src={mapSrc}
                className="h-[380px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] lg:grid-cols-[1.2fr_auto_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-3xl font-semibold tracking-[-0.03em] text-slate-900">Ready to take the next step?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">Book a free site visit with our team and explore our prime properties in person.</p>
            </div>
          </div>

          <BookSiteVisitButton className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700">
            Book Site Visit
          </BookSiteVisitButton>
          <Link href="/properties" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-slate-100">
            Browse Properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}