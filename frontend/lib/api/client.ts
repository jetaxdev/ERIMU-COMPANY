import axios from 'axios';

// All requests go through Next.js rewrites → backend, so the auth cookie travels same-domain
export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});
