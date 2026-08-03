"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  Eye,
  House,
  ImagePlus,
  MessageCircle,
  Pencil,
  Plus,
  SquarePen,
} from 'lucide-react';
import { DashboardSummary, getDashboardSummary } from '@/services/api/analytics';

const actionCards = [
  {
    label: 'Add Property',
    href: '/admin/properties',
    icon: <Plus className="h-4 w-4" />,
    className: 'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-700 border-rose-200',
  },
  {
    label: 'Upload Images',
    href: '/admin/gallery',
    icon: <ImagePlus className="h-4 w-4" />,
    className: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    label: 'New Blog',
    href: '/admin/blog',
    icon: <SquarePen className="h-4 w-4" />,
    className: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200',
  },
  {
    label: 'Update Homepage',
    href: '/admin/homepage',
    icon: <House className="h-4 w-4" />,
    className: 'bg-gradient-to-br from-violet-50 to-violet-100 text-violet-700 border-violet-200',
  },
];

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardSummary();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Properties', value: dashboard?.stats.total ?? 0 },
      { label: 'Available', value: dashboard?.stats.available ?? 0 },
      { label: 'Reserved', value: dashboard?.stats.reserved ?? 0 },
      { label: 'Sold', value: dashboard?.stats.sold ?? 0 },
    ],
    [dashboard],
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Good Morning, Admin 👋</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your properties with ease.</p>
          </div>
          <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:w-auto sm:justify-start">
            <CalendarDays className="h-4 w-4" />
            <span>Saturday, 20 Jul 2026</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:p-5">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:p-5">
        <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actionCards.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:translate-y-[-1px] sm:justify-start ${action.className}`}
            >
              {action.icon}
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Properties</h2>
            <Link href="/admin/properties" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {(dashboard?.recentProperties ?? []).map((property) => (
              <article key={property.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{property.title}</p>
                  <p className="text-xs text-slate-500">{formatLocation(property.location, property.town, property.county)}</p>
                </div>

                <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(property.status)}`}>{formatStatus(property.status)}</span>
                  <Link href={`/admin/properties`} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100" aria-label={`View ${property.title}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link href={`/admin/properties`} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100" aria-label={`Edit ${property.title}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
            {!loading && (dashboard?.recentProperties ?? []).length === 0 ? <EmptyState label="No properties found yet." /> : null}
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Recent Inquiries</h2>
              <Link href="/admin/inquiries" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {(dashboard?.recentInquiries ?? []).map((inquiry) => (
                <article key={inquiry.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{inquiry.fullName}</p>
                        <p className="text-xs text-slate-600">{inquiry.propertyTitle ? `${inquiry.message} - ${inquiry.propertyTitle}` : inquiry.message}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 sm:whitespace-nowrap">{formatDateTime(inquiry.createdAt)}</p>
                  </div>
                </article>
              ))}
              {!loading && (dashboard?.recentInquiries ?? []).length === 0 ? <EmptyState label="No inquiries yet." /> : null}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Upcoming Site Visits</h2>
              <Link href="/admin/site-visits" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {(dashboard?.upcomingSiteVisits ?? []).map((visit) => (
                <article key={visit.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{formatVisitDay(visit.visitDate)}</p>
                      <p className="text-sm font-semibold text-slate-800">{visit.propertyTitle}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatVisitTime(visit.visitDate)}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">{formatLocation(visit.propertyLocation, visit.propertyTown, visit.propertyCounty)}</p>
                      <p className="mt-1 text-xs text-slate-600">Client: {visit.clientName}</p>
                    </div>
                  </div>
                </article>
              ))}
              {!loading && (dashboard?.upcomingSiteVisits ?? []).length === 0 ? <EmptyState label="No upcoming site visits." /> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function formatStatus(status: DashboardSummary['recentProperties'][number]['status']) {
  return status.replaceAll('_', ' ');
}

function statusClass(status: DashboardSummary['recentProperties'][number]['status']) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-emerald-100 text-emerald-700';
    case 'RESERVED':
      return 'bg-amber-100 text-amber-700';
    case 'SOLD':
      return 'bg-violet-100 text-violet-700';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}

function formatLocation(location?: string | null, town?: string | null, county?: string | null) {
  return [location, town, county].filter(Boolean).join(', ') || 'Location not set';
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatVisitDay(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(new Date(value));
}

function formatVisitTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">{label}</div>;
}
