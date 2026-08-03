import { apiClient } from '@/lib/api/client';

export type SiteVisitPayload = {
  propertyId: string;
  fullName: string;
  phone: string;
  email?: string;
  visitDate: string;
  notes?: string;
};

export type SiteVisitRecord = {
  id: string;
  propertyId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  userId: string | null;
  companyId: string | null;
  visitDate: string;
  notes: string | null;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    slug: string;
    location: string | null;
    county: string | null;
    town: string | null;
  } | null;
};

export type CreateSiteVisitResponse = {
  siteVisit: SiteVisitRecord;
};

export type SiteVisitListResponse = {
  data: SiteVisitRecord[];
  meta: {
    total: number;
  };
};

export async function createSiteVisit(payload: SiteVisitPayload) {
  const response = await apiClient.post<CreateSiteVisitResponse>('/site-visits', payload);
  return response.data;
}

export async function getAdminSiteVisits() {
  const response = await apiClient.get<SiteVisitListResponse>('/site-visits');
  return response.data;
}
