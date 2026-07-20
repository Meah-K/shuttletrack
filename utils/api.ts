// ============================================================
// ShuttleTrack — api.ts
// Group 7 | CodeQuest 2026 | KNUST
// ============================================================
// Central API service file.
// Currently uses mockData for all calls.
// To switch to real backend: change BASE_URL and set USE_MOCK to false.
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  currentStudent,
  shuttles,
  routes,
  notifications,
} from '../mockData';
import type {
  Student,
  Shuttle,
  Route,
  AppNotification,
} from '../mockData';

// ─── CONFIG ──────────────────────────────────────────────────
// ─── CONFIG ──────────────────────────────────────────────────
const AUTH_URL = 'https://shuttletrack-production-6b61.up.railway.app';
const TRACKING_URL = 'https://shuttletrack-production-de59.up.railway.app';
const NOTIFICATION_URL = 'https://shuttletrack-production.up.railway.app';

const USE_MOCK = false;

const MOCK_DELAY = 800;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Backend doesn't send routeName yet — map routeId to a display name here.
const ROUTE_NAMES: Record<string, string> = {
  'route-A': 'Route A — Main Gate',
  'route-B': 'Route B — Paa Joe',
  'route-C': 'Route C — SRC',
};

// ─── TOKEN HELPERS ────────────────────────────────────────────
export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem('userToken', token);
}

export async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem('userToken');
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem('userToken');
}

// ─── LOGGED-IN USER HELPERS ───────────────────────────────────
export interface StoredUser {
  userId: string;
  name: string;
  role: 'STUDENT' | 'DRIVER';
}

export async function saveUser(user: StoredUser): Promise<void> {
  await AsyncStorage.setItem('userData', JSON.stringify(user));
}

export async function getUser(): Promise<StoredUser | null> {
  const data = await AsyncStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem('userData');
}

// ─── AUTH ────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  role: 'STUDENT' | 'DRIVER';
}

export interface RegisterRequest {
  name: string;
  studentId: string;
  email: string;
  password: string;
}

export async function loginStudent(data: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    const mockToken = 'mock-jwt-token-student-001';
    await saveToken(mockToken);
    await saveUser({
      userId: currentStudent.userId,
      name: currentStudent.name,
      role: 'STUDENT',
    });
    return {
      token: mockToken,
      userId: currentStudent.userId,
      name: currentStudent.name,
      role: 'STUDENT',
    };
  }

  const response = await fetch(`${AUTH_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Login failed');
  const result: LoginResponse = await response.json();
  await saveToken(result.token);
  await saveUser({ userId: result.userId, name: result.name, role: result.role });
  return result;
}

export async function registerStudent(data: RegisterRequest): Promise<void> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return;
  }

  const response = await fetch(`${AUTH_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

 if (!response.ok) {
    const errorBody = await response.text();
    console.log('REGISTER FAILED - Status:', response.status, 'Body:', errorBody);
    throw new Error('Registration failed');
  }
}

export async function loginDriver(data: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    const mockToken = 'mock-jwt-token-driver-001';
    await saveToken(mockToken);
    await saveUser({ userId: 'driver-001', name: 'Kwame Mensah', role: 'DRIVER' });
    return {
      token: mockToken,
      userId: 'driver-001',
      name: 'Kwame Mensah',
      role: 'DRIVER',
    };
  }

  const response = await fetch(`${AUTH_URL}/auth/driver/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Driver login failed');
  const result: LoginResponse = await response.json();
  await saveToken(result.token);
  await saveUser({ userId: result.userId, name: result.name, role: result.role });
  return result;
}

export async function logout(): Promise<void> {
  await clearToken();
  await clearUser();
}

// ─── TRACKING ─────────────────────────────────────────────────
export async function getShuttles(): Promise<Shuttle[]> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return shuttles;
  }

  const token = await getToken();
  const response = await fetch(`${TRACKING_URL}/tracking/shuttles`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch shuttles');
  const raw = await response.json();

  // Backend doesn't send routeName or etaMinutes yet — fill them in here
  // until Marvelle's real ETA calculation and routeName field are in place.
  return raw.map((s: any) => ({
    ...s,
    routeName: ROUTE_NAMES[s.routeId] ?? s.routeId,
    etaMinutes: s.etaMinutes ?? null,
  }));
}

export async function getRoutes(): Promise<Route[]> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return routes;
  }

  const token = await getToken();
  const response = await fetch(`${TRACKING_URL}/tracking/routes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch routes');
  return response.json();
}

export async function updateShuttleStatus(
  shuttleId: string,
  status: 'HAS_SPACE' | 'FULL'
): Promise<void> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return;
  }

  const token = await getToken();
  const response = await fetch(`${TRACKING_URL}/tracking/shuttles/${shuttleId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error('Failed to update status');
}

export async function updateShuttleLocation(
  shuttleId: string,
  latitude: number,
  longitude: number
): Promise<void> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return;
  }

  const token = await getToken();
  const response = await fetch(`${TRACKING_URL}/tracking/shuttles/${shuttleId}/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!response.ok) throw new Error('Failed to update location');
}

export interface EtaResponse {
  etaMinutes: number;
  shuttleId: string;
  status: 'HAS_SPACE' | 'FULL';
}

export async function getEta(stopId: string, routeId: string): Promise<EtaResponse | null> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return null;
  }

  const token = await getToken();
  const response = await fetch(`${TRACKING_URL}/tracking/eta?stopId=${stopId}&routeId=${routeId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

// ─── NOTIFICATIONS ────────────────────────────────────────────
export async function getNotifications(): Promise<AppNotification[]> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return notifications;
  }

  const token = await getToken();
  console.log("TOKEN BEING SENT:", token);
  const response = await fetch(`${NOTIFICATION_URL}/notifications`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.log('NOTIFICATIONS FAILED - Status:', response.status, 'Body:', errorBody);
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return;
  }

  const token = await getToken();
  console.log("TOKEN BEING SENT:", token);
  const response = await fetch(`${NOTIFICATION_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to mark notification as read');
}

export async function getShuttlesWithEta(): Promise<Shuttle[]> {
  const [shuttlesData, routesData] = await Promise.all([
    getShuttles(),
    getRoutes(),
  ]);

  const shuttlesWithEta = await Promise.all(
    shuttlesData.map(async (shuttle) => {
      if (shuttle.status !== 'HAS_SPACE') {
        return shuttle;
      }
      const route = routesData.find(r => r.routeId === shuttle.routeId);
      const firstStop = route?.stops[0];
      if (!firstStop) {
        return shuttle;
      }
      const eta = await getEta(firstStop.stopId, shuttle.routeId);
      return { ...shuttle, etaMinutes: eta?.etaMinutes ?? null };
    })
  );

  return shuttlesWithEta;
}