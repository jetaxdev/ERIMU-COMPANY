import type { PropertyListResponse, PropertyRecord } from '@/services/api/properties';

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

async function fetchServerJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${backendUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPropertyBySlug(slug: string): Promise<PropertyRecord | null> {
  const property = await fetchServerJson<PropertyRecord>(`/api/v1/properties/slug/${encodeURIComponent(slug)}`);
  return property;
}

export async function fetchPropertySlugs(): Promise<string[]> {
  const payload = await fetchServerJson<PropertyListResponse>('/api/v1/properties?limit=1000');
  return Array.isArray(payload?.data)
    ? payload.data
        .filter((item) => typeof item?.slug === 'string' && item.slug.trim().length > 0)
        .map((item) => item.slug.trim())
    : [];
}

export async function fetchPropertiesServer(query?: Record<string, unknown>): Promise<PropertyRecord[]> {
  const searchParams = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
  }

  const endpoint = `/api/v1/properties?${searchParams.toString()}`;
  const payload = await fetchServerJson<PropertyListResponse>(endpoint);

  return Array.isArray(payload?.data) ? payload.data : [];
}
