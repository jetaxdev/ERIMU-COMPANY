import { apiClient } from '@/lib/api/client';

export const propertyStatusOptions = ['AVAILABLE', 'RESERVED', 'SOLD', 'COMING_SOON'] as const;
export type PropertyStatus = (typeof propertyStatusOptions)[number];

export const propertyAmenityOptions = [
  'WATER',
  'ELECTRICITY',
  'SCHOOLS',
  'HOSPITALS',
  'ROAD',
  'TITLE_DEED',
  'FENCE',
  'BEACONED',
] as const;

export type PropertyAmenity = (typeof propertyAmenityOptions)[number];

export type PropertyImage = {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
};

export type PropertyRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  location: string | null;
  county: string | null;
  town: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  plotSize: string | null;
  type: string | null;
  status: PropertyStatus;
  featured: boolean;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  featuredImageId: string | null;
  images: PropertyImage[];
  amenities: { id: string; name: PropertyAmenity }[];
};

export type PropertyListResponse = {
  data: PropertyRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type PropertyQuery = {
  q?: string;
  county?: string;
  town?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
};

export type PropertyPayload = {
  title: string;
  slug?: string;
  description?: string;
  price?: number;
  location?: string;
  county?: string;
  town?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  plotSize?: string;
  type?: string;
  status?: PropertyStatus;
  featured?: boolean;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  amenities?: PropertyAmenity[];
};

export async function getProperties(query?: PropertyQuery) {
  const response = await apiClient.get<PropertyListResponse>('/properties', { params: query });
  return response.data;
}

export async function getProperty(id: string) {
  const response = await apiClient.get<PropertyRecord>(`/properties/${id}`);
  return response.data;
}

export async function getPropertyBySlug(slug: string) {
  const response = await apiClient.get<PropertyRecord>(`/properties/slug/${slug}`);
  return response.data;
}

export async function createProperty(payload: PropertyPayload) {
  const response = await apiClient.post<PropertyRecord>('/properties', payload);
  return response.data;
}

export async function updateProperty(id: string, payload: Partial<PropertyPayload>) {
  const response = await apiClient.patch<PropertyRecord>(`/properties/${id}`, payload);
  return response.data;
}

export async function deleteProperty(id: string) {
  const response = await apiClient.delete<PropertyRecord>(`/properties/${id}`);
  return response.data;
}

export async function addPropertyImage(
  propertyId: string,
  payload: { imageUrl?: string; caption?: string; isFeatured?: boolean; file?: File },
) {
  const formData = new FormData();

  if (payload.imageUrl) {
    formData.append('imageUrl', payload.imageUrl);
  }

  if (payload.caption) {
    formData.append('caption', payload.caption);
  }

  if (payload.isFeatured !== undefined) {
    formData.append('isFeatured', payload.isFeatured ? 'true' : 'false');
  }

  if (payload.file) {
    formData.append('file', payload.file);
  }

  const response = await apiClient.post<PropertyRecord>(`/properties/${propertyId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function deletePropertyImage(propertyId: string, imageId: string) {
  const response = await apiClient.delete<PropertyRecord>(`/properties/${propertyId}/images/${imageId}`);
  return response.data;
}

export async function reorderPropertyImages(
  propertyId: string,
  items: Array<{ id: string; sortOrder: number }>,
) {
  const response = await apiClient.patch<PropertyRecord>(`/properties/${propertyId}/images/reorder`, { items });
  return response.data;
}

export async function setPropertyFeaturedImage(propertyId: string, imageId: string) {
  const response = await apiClient.patch<PropertyRecord>(`/properties/${propertyId}/images/featured`, {
    imageId,
  });
  return response.data;
}
