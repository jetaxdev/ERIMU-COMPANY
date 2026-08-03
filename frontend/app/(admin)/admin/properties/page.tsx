'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useAdminProperties } from '@/hooks/admin/useAdminProperties';
import {
  propertyAmenityOptions,
  PropertyAmenity,
  propertyStatusOptions,
  PropertyPayload,
  PropertyRecord,
  PropertyStatus,
} from '@/services/api/properties';

type PropertyForm = {
  title: string;
  slug: string;
  description: string;
  price: string;
  location: string;
  county: string;
  town: string;
  plotSize: string;
  type: string;
  status: PropertyStatus;
  featured: boolean;
  amenities: PropertyAmenity[];
};

const defaultForm: PropertyForm = {
  title: '',
  slug: '',
  description: '',
  price: '',
  location: '',
  county: '',
  town: '',
  plotSize: '',
  type: '',
  status: 'COMING_SOON',
  featured: false,
  amenities: [],
};

export default function AdminPropertiesPage() {
  const {
    data,
    meta,
    loading,
    saving,
    refresh,
    saveProperty,
    removeProperty,
    addImage,
    removeImage,
    reorderImages,
    setFeaturedImage,
  } = useAdminProperties();

  const [form, setForm] = useState<PropertyForm>(defaultForm);
  const [editingPropertyId, setEditingPropertyId] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [selectedPropertyForImage, setSelectedPropertyForImage] = useState<string>('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const selectedProperty = useMemo(
    () => data.find((property) => property.id === selectedPropertyForImage),
    [data, selectedPropertyForImage],
  );

  if (loading) return <div className="p-8">Loading admin properties...</div>;

  function setField(key: keyof PropertyForm, value: PropertyForm[keyof PropertyForm]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function toPayload(): PropertyPayload {
    return {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || undefined,
      price: form.price ? Number(form.price) : undefined,
      location: form.location.trim() || undefined,
      county: form.county.trim() || undefined,
      town: form.town.trim() || undefined,
      plotSize: form.plotSize.trim() || undefined,
      type: form.type.trim() || undefined,
      status: form.status,
      featured: form.featured,
      amenities: form.amenities,
    };
  }

  function startEdit(property: PropertyRecord) {
    setEditingPropertyId(property.id);
    setForm({
      title: property.title,
      slug: property.slug || '',
      description: property.description || '',
      price: property.price?.toString() || '',
      location: property.location || '',
      county: property.county || '',
      town: property.town || '',
      plotSize: property.plotSize || '',
      type: property.type || '',
      status: property.status,
      featured: property.featured,
      amenities: property.amenities.map((amenity) => amenity.name),
    });
  }

  function resetForm() {
    setForm(defaultForm);
    setEditingPropertyId(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.title.trim()) {
      setError('Property title is required');
      return;
    }

    try {
      await saveProperty(toPayload(), editingPropertyId);
      setMessage(editingPropertyId ? 'Property updated.' : 'Property created.');
      resetForm();
    } catch {
      setError('Failed to save property. Check the form values and try again.');
    }
  }

  async function handleDelete(propertyId: string) {
    setError('');
    setMessage('');

    try {
      await removeProperty(propertyId);
      setMessage('Property deleted.');
      if (editingPropertyId === propertyId) {
        resetForm();
      }
    } catch {
      setError('Failed to delete property.');
    }
  }

  async function handleAddImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!selectedPropertyForImage) {
      setError('Select a property to add images.');
      return;
    }

    if (!imageUrl.trim() && !imageFile) {
      setError('Provide an image URL or choose a file.');
      return;
    }

    try {
      await addImage(selectedPropertyForImage, {
        imageUrl: imageUrl.trim() || undefined,
        caption: imageCaption.trim() || undefined,
        file: imageFile,
      });
      setImageUrl('');
      setImageCaption('');
      setImageFile(undefined);
      setMessage('Image added.');
    } catch {
      setError('Failed to add image.');
    }
  }

  async function moveImage(property: PropertyRecord, imageId: string, direction: 'up' | 'down') {
    const sorted = [...property.images].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = sorted.findIndex((image) => image.id === imageId);

    if (index < 0) {
      return;
    }

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) {
      return;
    }

    const temp = sorted[index];
    sorted[index] = sorted[swapIndex];
    sorted[swapIndex] = temp;

    const payload = sorted.map((image, idx) => ({ id: image.id, sortOrder: idx }));
    await reorderImages(property.id, payload);
  }

  function toggleAmenity(name: PropertyAmenity) {
    const exists = form.amenities.includes(name);

    if (exists) {
      setField(
        'amenities',
        form.amenities.filter((item) => item !== name),
      );
      return;
    }

    setField('amenities', [...form.amenities, name]);
  }

  return (
    <main className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Property Management</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create and manage land listings with the exact public-facing fields: title, location, price, plot size, type, status, amenities, and images.
        </p>

        {error ? <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        {message ? <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(value) => setField('title', value)} required />
            <Input label="Slug" value={form.slug} onChange={(value) => setField('slug', value)} />
          </div>

          <Input label="Description" value={form.description} onChange={(value) => setField('description', value)} textarea rows={4} />

          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Price" value={form.price} onChange={(value) => setField('price', value)} type="number" />
            <Input label="County" value={form.county} onChange={(value) => setField('county', value)} />
            <Input label="Town" value={form.town} onChange={(value) => setField('town', value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Location" value={form.location} onChange={(value) => setField('location', value)} />
            <Input label="Plot Size" value={form.plotSize} onChange={(value) => setField('plotSize', value)} placeholder="e.g. 50 by 100" />
            <Input label="Listing Type (Land)" value={form.type} onChange={(value) => setField('type', value)} />
            <Select
              label="Status"
              value={form.status}
              onChange={(value) => setField('status', value as PropertyStatus)}
              options={propertyStatusOptions.map((status) => ({ label: pretty(status), value: status }))}
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setField('featured', event.target.checked)}
            />
            <span>Featured listing</span>
          </label>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Amenities</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {propertyAmenityOptions.map((amenity) => {
                const checked = form.amenities.includes(amenity);
                return (
                  <label key={amenity} className="inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    <span>{pretty(amenity)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:bg-slate-400"
            >
              {saving ? 'Saving...' : editingPropertyId ? 'Update Property' : 'Add Property'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Properties</h2>
          <p className="text-sm text-slate-500">
            {meta.total} total | page {meta.page} / {meta.totalPages}
          </p>
        </div>

        <div className="space-y-4">
          {data.map((property) => (
            <article key={property.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{property.title}</h3>
                  <p className="text-sm text-slate-500">
                    {property.county || '-'} / {property.town || '-'} | {pretty(property.status)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatKES(property.price)} | {property.plotSize || (property.areaSqft ? `${property.areaSqft} sqft` : 'Size on request')} | {property.type || 'Land'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(property)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(property.id)}
                    className="rounded border border-rose-300 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyForImage(property.id)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                  >
                    Manage Images
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600">{property.description || 'No description'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span key={amenity.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {pretty(amenity.name)}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Property Images</h2>

        <div className="mt-4">
          <Select
            label="Property"
            value={selectedPropertyForImage}
            onChange={setSelectedPropertyForImage}
            options={[
              { label: 'Select property', value: '' },
              ...data.map((property) => ({ label: property.title, value: property.id })),
            ]}
          />
        </div>

        <form onSubmit={handleAddImage} className="mt-4 grid gap-4 md:grid-cols-3">
          <Input label="Image URL" value={imageUrl} onChange={setImageUrl} />
          <Input label="Caption" value={imageCaption} onChange={setImageCaption} />
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Image File</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0])}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </label>
          <div className="flex items-end md:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="h-10 rounded bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:bg-slate-400"
            >
              Add Image
            </button>
          </div>
        </form>

        {selectedProperty ? (
          <div className="mt-6 space-y-3">
            {[...selectedProperty.images]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((image, index, list) => (
                <div key={image.id} className="flex flex-wrap items-center gap-3 rounded border border-slate-200 p-3">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    className="max-w-[240px] truncate text-sm text-blue-700 underline"
                  >
                    {image.url}
                  </a>
                  <span className="text-xs text-slate-500">#{index + 1}</span>
                  {selectedProperty.featuredImageId === image.id ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">Featured</span>
                  ) : null}

                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      disabled={index === 0 || saving}
                      onClick={() => moveImage(selectedProperty, image.id, 'up')}
                      className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={index === list.length - 1 || saving}
                      onClick={() => moveImage(selectedProperty, image.id, 'down')}
                      className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => setFeaturedImage(selectedProperty.id, image.id)}
                      className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-800"
                    >
                      Set Featured
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => removeImage(selectedProperty.id, image.id)}
                      className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function pretty(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatKES(price: number | null | undefined) {
  if (!price) return 'Contact for price';
  return `KES ${new Intl.NumberFormat('en-KE').format(price)}`;
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  rows = 3,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? ' *' : ''}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
      )}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
