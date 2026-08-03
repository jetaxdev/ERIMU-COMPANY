"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { Film, ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  GalleryMediaType,
  GalleryRecord,
  createGallery,
  deleteGallery,
  getAdminGallery,
  updateGallery,
  uploadGalleryAsset,
} from '@/services/api/gallery';

type GalleryFormState = {
  title: string;
  slug: string;
  mediaType: GalleryMediaType;
  category: string;
  mediaUrl: string;
  thumbnailUrl: string;
  description: string;
  duration: string;
  sortOrder: string;
};

const emptyForm: GalleryFormState = {
  title: '',
  slug: '',
  mediaType: 'IMAGE',
  category: '',
  mediaUrl: '',
  thumbnailUrl: '',
  description: '',
  duration: '',
  sortOrder: '0',
};

const defaultGalleryCategories = [
  'Available Properties',
  'Sold Properties',
  'Site Visits',
  'Title Deed Handover',
  'Developments',
  'Aerial Views',
  'General',
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryRecord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<GalleryFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setLoading(true);

    try {
      const result = await getAdminGallery();
      setItems(result.data);
      setCategories(result.categories);
    } finally {
      setLoading(false);
    }
  }

  const sortedItems = useMemo(
    () => items.slice().sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title)),
    [items],
  );

  const categoryOptions = useMemo(() => {
    const options = new Set(defaultGalleryCategories);

    categories.forEach((category) => {
      if (category.trim()) {
        options.add(category.trim());
      }
    });

    if (form.category.trim()) {
      options.add(form.category.trim());
    }

    return Array.from(options).sort((left, right) => left.localeCompare(right));
  }, [categories, form.category]);

  function updateField<Key extends keyof GalleryFormState>(key: Key, value: GalleryFormState[Key]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function applyItem(item: GalleryRecord) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      mediaType: item.mediaType,
      category: item.category,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl || '',
      description: item.description || '',
      duration: item.duration || '',
      sortOrder: String(item.sortOrder),
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.category.trim() || !form.mediaUrl.trim()) {
      setError('Title, category, and media URL are required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        mediaType: form.mediaType,
        category: form.category.trim(),
        mediaUrl: form.mediaUrl.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || undefined,
        description: form.description.trim() || undefined,
        duration: form.duration.trim() || undefined,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (editingId) {
        await updateGallery(editingId, payload);
        setSuccess('Gallery item updated successfully.');
      } else {
        await createGallery(payload);
        setSuccess('Gallery item created successfully.');
      }

      await loadGallery();
      resetForm();
    } catch {
      setError('Unable to save gallery item. Please check the data and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this gallery item?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await deleteGallery(id);
      await loadGallery();
      if (editingId === id) {
        resetForm();
      }
      setSuccess('Gallery item deleted.');
    } catch {
      setError('Unable to delete gallery item right now.');
    }
  }

  async function handleFileUpload(target: 'mediaUrl' | 'thumbnailUrl', file?: File) {
    if (!file) {
      return;
    }

    setError('');
    setSuccess('');

    if (target === 'mediaUrl') {
      setUploadingMedia(true);
    } else {
      setUploadingThumbnail(true);
    }

    try {
      const result = await uploadGalleryAsset(file);
      updateField(target, result.url);
      setSuccess(target === 'mediaUrl' ? 'Media image uploaded successfully.' : 'Thumbnail uploaded successfully.');
    } catch {
      setError('Image upload failed. Please check Cloudinary settings and try again.');
    } finally {
      if (target === 'mediaUrl') {
        setUploadingMedia(false);
      } else {
        setUploadingThumbnail(false);
      }
    }
  }

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8">Loading gallery items...</div>;
  }

  return (
    <main className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Gallery Management</h1>
          <p className="mt-2 text-sm text-slate-500">Manage every public gallery image, video, category, and description from here.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">{sortedItems.length} items</p>
          <p>{categories.length} categories</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <ImagePlus className="h-4 w-4 text-red-600" />
          {editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" required>
            <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className={fieldClass} placeholder="Kikuyu Green Gardens" />
          </Field>
          <Field label="Slug">
            <input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} className={fieldClass} placeholder="kikuyu-green-gardens" />
          </Field>
          <Field label="Media Type" required>
            <select value={form.mediaType} onChange={(event) => updateField('mediaType', event.target.value as GalleryMediaType)} className={fieldClass}>
              <option value="IMAGE">IMAGE</option>
              <option value="VIDEO">VIDEO</option>
            </select>
          </Field>
          <Field label="Category" required>
            <select value={form.category} onChange={(event) => updateField('category', event.target.value)} className={fieldClass}>
              <option value="" disabled>Select a category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Media URL" required>
            <div className="space-y-2">
              <input value={form.mediaUrl} onChange={(event) => updateField('mediaUrl', event.target.value)} className={fieldClass} placeholder="https://..." />
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
                  <Plus className="h-3.5 w-3.5" />
                  {uploadingMedia ? 'Uploading image...' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingMedia || saving}
                    onChange={(event) => {
                      void handleFileUpload('mediaUrl', event.target.files?.[0]);
                      event.currentTarget.value = '';
                    }}
                  />
                </label>
                <span className="text-xs text-slate-500">Select an image to upload and auto-fill the media URL.</span>
              </div>
            </div>
          </Field>
          <Field label="Thumbnail URL">
            <div className="space-y-2">
              <input value={form.thumbnailUrl} onChange={(event) => updateField('thumbnailUrl', event.target.value)} className={fieldClass} placeholder="Video preview image URL" />
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
                  <Plus className="h-3.5 w-3.5" />
                  {uploadingThumbnail ? 'Uploading thumbnail...' : 'Upload thumbnail'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingThumbnail || saving}
                    onChange={(event) => {
                      void handleFileUpload('thumbnailUrl', event.target.files?.[0]);
                      event.currentTarget.value = '';
                    }}
                  />
                </label>
                <span className="text-xs text-slate-500">Optional: use a custom preview image.</span>
              </div>
            </div>
          </Field>
          <Field label="Duration">
            <input value={form.duration} onChange={(event) => updateField('duration', event.target.value)} className={fieldClass} placeholder="01:28" />
          </Field>
          <Field label="Sort Order">
            <input type="number" value={form.sortOrder} onChange={(event) => updateField('sortOrder', event.target.value)} className={fieldClass} min={0} />
          </Field>
        </div>

        <Field label="Description">
          <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={4} className={fieldClass} placeholder="Short description for the card" />
        </Field>

        {error ? <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        {success ? <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
            {saving ? 'Saving...' : editingId ? 'Update Gallery Item' : 'Create Gallery Item'}
          </button>
          <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Reset
          </button>
        </div>
      </form>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Existing Gallery Items</h2>
          <p className="text-sm text-slate-500">Images and videos are shown in the public gallery exactly as configured here.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {sortedItems.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
              <div className="flex gap-4 p-4">
                <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.thumbnailUrl || item.mediaUrl})` }} />
                  {item.mediaType === 'VIDEO' ? <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">VIDEO</span> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-slate-900">{item.title}</h3>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">{item.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{item.description || 'No description yet.'}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.mediaType} • order {item.sortOrder} • {item.slug}</p>
                  <p className="mt-2 break-all text-xs text-slate-500">{item.mediaUrl}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-4 py-3">
                <button type="button" onClick={() => applyItem(item)} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-700">
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  );
}

const fieldClass = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900';
