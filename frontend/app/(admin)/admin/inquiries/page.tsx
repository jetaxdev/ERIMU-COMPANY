'use client';

import { useEffect, useState } from 'react';
import { getAdminInquiries, InquiryRecord } from '@/services/api/inquiries';

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminInquiriesPage() {
  const [data, setData] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminInquiries()
      .then((result) => {
        setData(result.data || []);
      })
      .catch(() => {
        setError('Failed to load inquiries.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="space-y-6 p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Inquiries</h1>
        <p className="mt-2 text-sm text-slate-600">All contact form submissions appear here.</p>

        {loading ? <p className="mt-4 text-sm text-slate-500">Loading inquiries...</p> : null}
        {error ? <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        {!loading && !error && data.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No inquiries yet.</p>
        ) : null}

        {!loading && !error && data.length > 0 ? (
          <div className="mt-4 space-y-3">
            {data.map((inquiry) => (
              <article key={inquiry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{inquiry.fullName}</p>
                    <p className="text-xs text-slate-600">{inquiry.email}{inquiry.phone ? ` | ${inquiry.phone}` : ''}</p>
                    <p className="mt-1 text-xs text-slate-500">Status: {inquiry.status}</p>
                  </div>
                  <p className="text-xs text-slate-500">{formatDateTime(inquiry.createdAt)}</p>
                </div>

                <p className="mt-3 text-sm text-slate-700">{inquiry.message}</p>
                {inquiry.property?.title ? (
                  <p className="mt-2 text-xs text-slate-500">Related Property: {inquiry.property.title}</p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
