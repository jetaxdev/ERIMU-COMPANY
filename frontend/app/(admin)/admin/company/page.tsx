'use client';

import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAdminCompany } from '@/hooks/admin/useAdminCompany';
import { CompanyPayload } from '@/services/api/company';

type FormState = {
  name: string;
  logoUrl: string;
  phonesText: string;
  emailsText: string;
  address: string;
  googleMapsUrl: string;
  mission: string;
  vision: string;
  about: string;
  socialLinksText: string;
};

const initialForm: FormState = {
  name: '',
  logoUrl: '',
  phonesText: '',
  emailsText: '',
  address: '',
  googleMapsUrl: '',
  mission: '',
  vision: '',
  about: '',
  socialLinksText: '',
};

export default function AdminCompanyPage() {
  const { company, loading, saving, save } = useAdminCompany();
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!company) {
      return;
    }

    setForm({
      name: company.name || '',
      logoUrl: company.logoUrl || '',
      phonesText: (company.phones || []).join('\n'),
      emailsText: (company.emails || []).join('\n'),
      address: company.address || '',
      googleMapsUrl: company.googleMapsUrl || '',
      mission: company.mission || '',
      vision: company.vision || '',
      about: company.about || '',
      socialLinksText: (company.socialLinks || [])
        .map((item) => `${item.platform}|${item.url}`)
        .join('\n'),
    });
  }, [company]);

  const isEditing = useMemo(() => Boolean(company?.id), [company?.id]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function splitLines(value: string) {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  function buildPayload(): CompanyPayload {
    const socialLinks = splitLines(form.socialLinksText)
      .map((line) => {
        const [platform, url] = line.split('|').map((part) => part.trim());
        return { platform, url };
      })
      .filter((item) => item.platform && item.url);

    return {
      name: form.name.trim(),
      logoUrl: form.logoUrl.trim() || undefined,
      phones: splitLines(form.phonesText),
      emails: splitLines(form.emailsText),
      address: form.address.trim() || undefined,
      googleMapsUrl: form.googleMapsUrl.trim() || undefined,
      mission: form.mission.trim() || undefined,
      vision: form.vision.trim() || undefined,
      about: form.about.trim() || undefined,
      socialLinks,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Company name is required');
      return;
    }

    try {
      await save(buildPayload());
      setSuccess('Company information saved successfully.');
    } catch {
      setError('Unable to save company information. Please check the inputs and try again.');
    }
  }

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8">Loading company profile...</div>;
  }

  return (
    <main className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Company Information</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage the business details that power your website pages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Company Name" required>
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="ERIMU Company"
            />
          </Field>

          <Field label="Logo URL">
            <input
              value={form.logoUrl}
              onChange={(event) => updateField('logoUrl', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="https://example.com/logo.png"
            />
          </Field>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Phones (one per line)">
            <textarea
              value={form.phonesText}
              onChange={(event) => updateField('phonesText', event.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder={'+256700000000\n+256781111111'}
            />
          </Field>

          <Field label="Emails (one per line)">
            <textarea
              value={form.emailsText}
              onChange={(event) => updateField('emailsText', event.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder={'hello@erimu.com\nsales@erimu.com'}
            />
          </Field>
        </div>

        <Field label="Address">
          <textarea
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder="Company address"
          />
        </Field>

        <Field label="Google Maps URL">
          <input
            value={form.googleMapsUrl}
            onChange={(event) => updateField('googleMapsUrl', event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder="https://maps.google.com/?q=..."
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Mission">
            <textarea
              value={form.mission}
              onChange={(event) => updateField('mission', event.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="Your mission"
            />
          </Field>

          <Field label="Vision">
            <textarea
              value={form.vision}
              onChange={(event) => updateField('vision', event.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="Your vision"
            />
          </Field>
        </div>

        <Field label="About">
          <textarea
            value={form.about}
            onChange={(event) => updateField('about', event.target.value)}
            rows={5}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder="Company profile or story"
          />
        </Field>

        <Field label="Social Links (one per line in format Platform|URL)">
          <textarea
            value={form.socialLinksText}
            onChange={(event) => updateField('socialLinksText', event.target.value)}
            rows={5}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder={'Facebook|https://facebook.com/your-page\nInstagram|https://instagram.com/your-page'}
          />
        </Field>

        {error ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        ) : null}

        {success ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Company' : 'Create Company'}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  );
}
