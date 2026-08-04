// ============================================================
// ShuttleTrack — api.ts
// Group 7 | CodeQuest 2026 | KNUST
// ============================================================
// Central API service file.
// All calls route through the API Gateway.
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
export const BASE_URL = 'https://api-gateway-wqfc.onrender.com';
const USE_MOCK = false;

const MOCK_DELAY = 800;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Backend doesn't send routeName yet — map routeId to a display name here.
const ROUTE_NAMES: Record<string, string> = {
  'route-A': 'Route A — KSB',
  'route-B': 'Route B — KSB to Brunei',
  'route-C': 'Route C — Pharmacy to Gaza',
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
  email: string;
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
    await saveUser({ userId: currentStudent.userId, name: currentStudent.name, role: 'STUDENT', email: data.email });
    return {
      token: mockToken,
      userId: currentStudent.userId,
      name: currentStudent.name,
      role: 'STUDENT',
    };
  }

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Login failed');
  const result: LoginResponse = await response.json();
  await saveToken(result.token);
  await saveUser({ userId: result.userId, name: result.name, role: result.role, email: data.email });
  return result;
}

export async function registerStudent(data: RegisterRequest): Promise<void> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    return;
  }

  const response = await fetch(`${BASE_URL}/auth/register`, {
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
    const mockResult = {
      userId: 'driver-001',
      name: 'Kwame Mensah',
      role: 'DRIVER' as const,
    };
    await saveToken(mockToken);
    await saveUser({ userId: mockResult.userId, name: mockResult.name, role: mockResult.role, email: data.email });
    return {
      token: mockToken,
      userId: mockResult.userId,
      name: mockResult.name,
      role: mockResult.role,
    };
  }

  const response = await fetch(`${BASE_URL}/auth/driver/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Driver login failed');
  const result: LoginResponse = await response.json();
  await saveToken(result.token);
  await saveUser({ userId: result.userId, name: result.name, role: result.role, email: data.email });
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
  const response = await fetch(`${BASE_URL}/tracking/shuttles`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch shuttles');
  const raw = await response.json();

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
  const response = await fetch(`${BASE_URL}/tracking/routes`, {
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
  const response = await fetch(`${BASE_URL}/tracking/shuttles/${shuttleId}/status`, {
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
  const response = await fetch(`${BASE_URL}/tracking/shuttles/${shuttleId}/location`, {
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
  const response = await fetch(`${BASE_URL}/tracking/eta?stopId=${stopId}&routeId=${routeId}`, {
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
  const response = await fetch(`${BASE_URL}/notifications`, {
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
  const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
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
      const route = routesData.find(
        r => r.routeId === shuttle.routeId
      );

      let etaMinutes = null;

      if (shuttle.status === 'HAS_SPACE') {
        const firstStop = route?.stops[0];

        if (firstStop) {
          const eta = await getEta(
            firstStop.stopId,
            shuttle.routeId
          );

          etaMinutes = eta?.etaMinutes ?? null;
        }
      }

      return {
        ...shuttle,
        routeName: route?.name ?? shuttle.routeId,
        etaMinutes,
      };
    })
  );

  return shuttlesWithEta;
}

// ─── BUSINESSES ────────────────────────────────────────────────
export interface Business {
  id: string;
  name: string;
  category: string;
  distance: string;
  nearStop: string;
  deal: string | null;
  rating: number;
  icon: string;
  color: string;
}

export async function getNearbyBusinesses(): Promise<Business[]> {
  const token = await getToken();
  const response = await fetch(`${BASE_URL}/businesses`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch businesses: ${response.status}`);
  }
  return response.json();
}