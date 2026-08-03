'use client';

import { useEffect, useState } from 'react';
import { getAdminSiteVisits, SiteVisitRecord } from '@/services/api/site-visits';

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatLocation(visit: SiteVisitRecord) {
  const location = [visit.property?.location, visit.property?.town, visit.property?.county]
    .filter(Boolean)
    .join(', ');

  return location || 'Location not set';
}

export default function AdminSiteVisitsPage() {
  const [data, setData] = useState<SiteVisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminSiteVisits()
      .then((result) => {
        setData(result.data || []);
      })
      .catch(() => {
        setError('Failed to load site visit requests.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="space-y-6 p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Site Visit Requests</h1>
        <p className="mt-2 text-sm text-slate-600">All submitted site visit requests appear here for follow-up.</p>

        {loading ? <p className="mt-4 text-sm text-slate-500">Loading site visit requests...</p> : null}
        {error ? <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        {!loading && !error && data.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No site visit requests yet.</p>
        ) : null}

        {!loading && !error && data.length > 0 ? (
          <div className="mt-4 space-y-3">
            {data.map((visit) => (
              <article key={visit.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{visit.fullName || 'Unnamed visitor'}</p>
                    <p className="text-xs text-slate-600">
                      {visit.email || 'No email'}{visit.phone ? ` | ${visit.phone}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Requested Visit: {formatDateTime(visit.visitDate)}</p>
                  </div>
                  <p className="text-xs text-slate-500">Submitted: {formatDateTime(visit.createdAt)}</p>
                </div>

                <div className="mt-3 text-sm text-slate-700">
                  <p className="font-medium text-slate-800">{visit.property?.title || 'Unknown property'}</p>
                  <p className="text-xs text-slate-500">{formatLocation(visit)}</p>
                </div>

                {visit.notes ? <p className="mt-3 text-sm text-slate-700">{visit.notes}</p> : null}
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
