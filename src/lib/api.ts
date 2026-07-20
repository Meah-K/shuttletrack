/**
 * Shared API client for both the Student App and the Driver App.
 *
 * - One Axios instance with a base URL.
 * - The auth token is attached automatically to every request.
 * - All API calls live here so we have one place to change them.
 *
 * Owner: Salma
 *
 * Install once:
 *   npm install axios
 */

import axios from 'axios';
import { getToken } from './tokenStorage';

// ---------- 1. CHANGE THIS LINE WHEN BACKEND IS LIVE ----------
// Local dev: 'http://localhost:8080' (works on simulator)
// Phone testing: replace 'localhost' with your laptop's WiFi IP, e.g. 'http://192.168.1.5:8080'
// Production: 'https://shuttletrack.up.railway.app' (or whatever Railway gives us)
const BASE_URL = 'https://airy-trust-production-8d38.up.railway.app';
// --------------------------------------------------------------

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor — runs before every request leaves the app.
// It grabs the saved token and adds it as the Authorization header.
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// AUTH endpoints — /api/auth
// ============================================================
export const authApi = {
  register: (data: { name: string; email: string; password: string; studentId: string }) =>
    api.post('/api/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  driverLogin: (email: string, password: string) =>
    api.post('/api/auth/driver/login', { email, password }),

  logout: () => api.post('/api/auth/logout'),
};

// ============================================================
// TRACKING endpoints — /api/tracking
// ============================================================
export const trackingApi = {
  /** Student App polls this every 5 seconds for the live map. */
  getShuttles: () => api.get('/api/tracking/shuttles'),
  getShuttle: (id: string) => api.get(`/api/tracking/shuttles/${id}`),

  /** Driver toggles HAS_SPACE / FULL. */
  updateStatus: (id: string, status: 'HAS_SPACE' | 'FULL' | 'INACTIVE') =>
    api.put(`/api/tracking/shuttles/${id}/status`, { status }),

  /** Driver app sends GPS every 10 seconds. */
  updateLocation: (id: string, lat: number, lng: number) =>
    api.post(`/api/tracking/shuttles/${id}/location`, { lat, lng }),

  getRoutes: () => api.get('/api/tracking/routes'),
  getEta: (stopId: string) => api.get(`/api/tracking/eta?stopId=${stopId}`),
};

// ============================================================
// NOTIFICATIONS endpoints — /api/notifications
// ============================================================
export const notificationsApi = {
  list: () => api.get('/api/notifications'),
  markRead: (id: string) => api.put(`/api/notifications/${id}/read`),
  broadcast: (routeId: string, message: string) =>
    api.post('/api/notifications/broadcast', { routeId, message }),
};