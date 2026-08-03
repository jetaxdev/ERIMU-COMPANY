import axios from 'axios';

const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

export const apiClient = axios.create({
  baseURL: backendBaseUrl ? `${backendBaseUrl}/api/v1` : '/api',
  withCredentials: true,
});
