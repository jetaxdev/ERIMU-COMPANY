import { apiClient } from '@/lib/api/client';

export type DashboardSummary = {
  stats: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
  notifications: {
    inquiries: number;
    siteVisits: number;
  };
  recentProperties: Array<{
    id: string;
    title: string;
    location: string | null;
    county: string | null;
    town: string | null;
    price: number | null;
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'COMING_SOON';
    imageUrl: string | null;
  }>;
  recentInquiries: Array<{
    id: string;
    fullName: string;
    message: string;
    email: string;
    propertyTitle: string | null;
    createdAt: string;
  }>;
  upcomingSiteVisits: Array<{
    id: string;
    visitDate: string;
    propertyTitle: string;
    propertyLocation: string | null;
    propertyCounty: string | null;
    propertyTown: string | null;
    clientName: string;
  }>;
};

export async function getDashboardSummary() {
  const response = await apiClient.get<DashboardSummary>('/analytics/dashboard');
  return response.data;
}