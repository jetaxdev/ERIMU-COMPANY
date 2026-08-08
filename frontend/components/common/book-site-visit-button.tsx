'use client';

import { createPortal } from 'react-dom';
import { ReactNode, useEffect, useState } from 'react';
import { createSiteVisit } from '@/services/api/site-visits';
import { getProperties } from '@/services/api/properties';

type BookSiteVisitButtonProps = {
  className: string;
  children: ReactNode;
  propertyId?: string;
  propertyTitle?: string;
};

export function BookSiteVisitButton({ className, children, propertyId, propertyTitle }: BookSiteVisitButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    visitDate: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  async function resolvePropertyId() {
    if (propertyId) {
      return propertyId;
    }

    const preferred = await getProperties({ page: 1, limit: 1, status: 'AVAILABLE' });
    if (preferred.data.length > 0) {
      return preferred.data[0].id;
    }

    const fallback = await getProperties({ page: 1, limit: 1 });
    if (fallback.data.length > 0) {
      return fallback.data[0].id;
    }

    return null;
  }

  function openModal() {
    setFeedback(null);

    if (!form.visitDate) {
      const suggestedDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const localValue = new Date(suggestedDate.getTime() - suggestedDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);

      setForm((prev) => ({ ...prev, visitDate: localValue }));
    }

    setOpen(true);
  }

  const modal = open ? (
    <div className="fixed inset-0 z-[90] flex items-start sm:items-center justify-center overflow-y-auto bg-slate-950/65 px-4 pt-6 pb-6 sm:px-6 sm:py-6 backdrop-blur-md">
      <div className="relative my-auto w-full max-w-lg max-h-[calc(100dvh-4rem)] overflow-hidden rounded-[1.25rem] border border-white/60 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5 sm:max-w-xl sm:max-h-[calc(100dvh-3rem)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-blue-600 to-amber-400" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4 border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,0.92))] px-5 py-4 sm:px-7">
          <div className="max-w-[80%]">
            <h3 className="text-xl font-bold tracking-[-0.03em] text-slate-900 sm:text-2xl">Schedule your land visit</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {propertyTitle || 'See the property in person and let us guide you through the details.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:text-red-600"
            aria-label="Close modal"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <form
          className="relative space-y-4 overflow-y-auto px-6 py-6 sm:px-7"
          onSubmit={async (event) => {
            event.preventDefault();
            setFeedback(null);
            setSubmitting(true);

            try {
              const selectedPropertyId = await resolvePropertyId();

              if (!selectedPropertyId) {
                setFeedback({
                  type: 'error',
                  message: 'No property is currently available for scheduling. Please try again later.',
                });
                return;
              }

              await createSiteVisit({
                propertyId: selectedPropertyId,
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
                email: form.email.trim() || undefined,
                visitDate: new Date(form.visitDate).toISOString(),
              });

              setFeedback({
                type: 'success',
                message: 'Site visit request sent successfully. Our team will follow up shortly.',
              });

              setForm((prev) => ({
                ...prev,
                phone: '',
              }));
            } catch {
              setFeedback({
                type: 'error',
                message: 'Failed to send site visit request. Please try again.',
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Full Name</span>
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="Your full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label className="space-y-2 sm:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Phone Number</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="07xx xxx xxx"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label className="space-y-2 sm:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email (optional)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label className="space-y-2 sm:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Visit Date</span>
              <input
                required
                type="date"
                value={form.visitDate}
                onChange={(event) => setForm((prev) => ({ ...prev, visitDate: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(37,99,235,0.2)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending Request...' : 'Send Site Visit Request'}
          </button>

          <p className="text-xs leading-6 text-slate-500">We’ll confirm availability by phone or email and keep the process simple.</p>

          {feedback ? (
            <p
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                feedback.type === 'success'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              {feedback.message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        {children}
      </button>

      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
}
