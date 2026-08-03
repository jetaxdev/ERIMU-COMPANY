import { apiClient } from '@/lib/api/client';

export const galleryMediaTypeOptions = ['IMAGE', 'VIDEO'] as const;
export type GalleryMediaType = (typeof galleryMediaTypeOptions)[number];

export type GalleryRecord = {
  id: string;
  title: string;
  slug: string;
  mediaType: GalleryMediaType;
  category: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  description: string | null;
  duration: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GalleryListResponse = {
  data: GalleryRecord[];
  categories: string[];
  meta: {
    total: number;
  };
};

export type GalleryPayload = {
  title: string;
  slug?: string;
  mediaType: GalleryMediaType;
  category: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  description?: string;
  duration?: string;
  sortOrder?: number;
};

export type UploadAssetResponse = {
  message: string;
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
};

export async function getGallery() {
  const response = await apiClient.get<GalleryListResponse>('/gallery');
  return response.data;
}

export async function getAdminGallery() {
  const response = await apiClient.get<GalleryListResponse>('/gallery/admin');
  return response.data;
}

export async function createGallery(payload: GalleryPayload) {
  const response = await apiClient.post<GalleryRecord>('/gallery', payload);
  return response.data;
}

export async function updateGallery(id: string, payload: Partial<GalleryPayload>) {
  const response = await apiClient.patch<GalleryRecord>(`/gallery/${id}`, payload);
  return response.data;
}

export async function deleteGallery(id: string) {
  const response = await apiClient.delete<GalleryRecord>(`/gallery/${id}`);
  return response.data;
}

export async function uploadGalleryAsset(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadAssetResponse>('/uploads', formData);

  return response.data;
}