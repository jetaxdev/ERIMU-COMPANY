import { apiClient } from '@/lib/api/client';

export type InquiryPayload = {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type InquiryRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  propertyId: string | null;
  userId: string | null;
  companyId: string | null;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

export type CreateInquiryResponse = {
  inquiry: InquiryRecord;
  emailSent: boolean;
  emailTarget: string | null;
};

export type InquiryListResponse = {
  data: InquiryRecord[];
  meta: {
    total: number;
  };
};

export async function createInquiry(payload: InquiryPayload) {
  const response = await apiClient.post<CreateInquiryResponse>('/inquiries', payload);
  return response.data;
}

export async function getAdminInquiries() {
  const response = await apiClient.get<InquiryListResponse>('/inquiries');
  return response.data;
}
