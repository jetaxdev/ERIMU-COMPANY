import { apiClient } from '@/lib/api/client';

export type SocialLink = {
  platform: string;
  url: string;
};

export type CompanyPayload = {
  name: string;
  logoUrl?: string;
  phones?: string[];
  emails?: string[];
  address?: string;
  googleMapsUrl?: string;
  mission?: string;
  vision?: string;
  about?: string;
  socialLinks?: SocialLink[];
};

export type CompanyProfile = CompanyPayload & {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export async function getCompanyProfile() {
  const response = await apiClient.get<CompanyProfile | null>('/company');
  return response.data;
}

export async function createCompany(payload: CompanyPayload) {
  const response = await apiClient.post<CompanyProfile>('/company', payload);
  return response.data;
}

export async function updateCompany(id: string, payload: CompanyPayload) {
  const response = await apiClient.patch<CompanyProfile>(`/company/${id}`, payload);
  return response.data;
}
