'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { createSiteVisit } from '@/services/api/site-visits';
import { getProperties, PropertyRecord } from '@/services/api/properties';

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  visitDate: string;
};

export default function BookSiteVisitPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [form, setForm] = useState<FormState>({
    fullName: '',
    phone: '',
    email: '',
    visitDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProperties() {
      try {
        const result = await getProperties({ page: 1, limit: 100 });
        const list = result.data || [];
        setProperties(list);

        const available = list.find((item) => item.status === 'AVAILABLE');
        setSelectedPropertyId((available || list[0])?.id || '');
      } catch {
        setProperties([]);
      }
    }

    const suggestedDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const localValue = new Date(suggestedDate.getTime() - suggestedDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);

    setForm((prev) => ({ ...prev, visitDate: localValue }));
    loadProperties();
  }, []);

  const selectedProperty = useMemo(
    () => properties.find((item) => item.id === selectedPropertyId) || null,
    [properties, selectedPropertyId],
  );

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!selectedPropertyId) {
      setError('No property is available for booking right now.');
      return;
    }

    setSubmitting(true);

    try {
      await createSiteVisit({
        propertyId: selectedPropertyId,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        visitDate: new Date(form.visitDate).toISOString(),
      });

      setMessage('Site visit request submitted successfully. Our team will contact you shortly.');
      setForm((prev) => ({
        ...prev,
        fullName: '',
        phone: '',
        email: '',
      }));
    } catch {
      setError('We could not submit your site visit request right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
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
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Contact Us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-600">Site Visit</p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">Book Site Visit</h1>
            <p className="mt-2 text-sm text-slate-600">Fill this site visit form. This is different from the Contact Us message form.</p>
          </div>

          <form onSubmit={submitForm} className="space-y-4">
            <input
              required
              type="text"
              placeholder="Full name"
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
            />

            <input
              required
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
            />

            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none"
            />

            <input
              required
              type="date"
              value={form.visitDate}
              onChange={(event) => setForm((prev) => ({ ...prev, visitDate: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none"
            />

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Property linked to this booking</p>
              <p className="mt-1">{selectedProperty ? selectedProperty.title : 'Loading available property...'}</p>
            </div>

            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            {message ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.24)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
            >
              <CalendarDays className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Site Visit Request'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
