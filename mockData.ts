// ============================================================
// ShuttleTrack — mockData.ts
// Group 7 | CodeQuest 2026 | KNUST
// ============================================================
// Shared fake database for the entire app, now with TypeScript types.
// ============================================================


// ─── TYPES ──────────────────────────────────────────────────
export type ShuttleStatus = 'HAS_SPACE' | 'FULL' | 'INACTIVE';
export type UserRole = 'STUDENT' | 'DRIVER';
export type NotificationType = 'DELAY' | 'STATUS' | 'GENERAL';
export type WalkOrWaitResult = 'WALK' | 'WAIT';

export interface Student {
  userId: string;
  name: string;
  studentId: string;
  email: string;
  role: UserRole;
}

export interface Driver {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  assignedRouteId: string;
  shuttleId: string;
}

export interface Stop {
  stopId: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface Route {
  routeId: string;
  name: string;
  shortName: string;
  color: string;
  totalStops: number;
  loopTimeMinutes: number;
  stops: Stop[];
}

export interface Shuttle {
  shuttleId: string;
  routeId: string;
  routeName: string;
  driverId: string | null;
  status: ShuttleStatus;
  latitude: number;
  longitude: number;
  etaMinutes: number | null;
  lastUpdated: string;
}

export interface AppNotification {
  notificationId: string;
  title: string;
  message: string;
  affectedRouteId: string | null;
  affectedRouteName: string | null;
  type: NotificationType;
  isRead: boolean;
  sentAt: string;
  timeAgo: string;
}

export interface WalkOrWaitRecommendation {
  recommendation: WalkOrWaitResult;
  walkingTimeMinutes: number;
  shuttleEta: number | null;
  distanceMeters?: number;
  reason?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}


// ─── CURRENT LOGGED-IN STUDENT ───────────────────────────────
export const currentStudent: Student = {
  userId: "student-001",
  name: "Ama Asiamah",
  studentId: "21100176",
  email: "ama@st.knust.edu.gh",
  role: "STUDENT",
};


// ─── CURRENT LOGGED-IN DRIVER ────────────────────────────────
export const currentDriver: Driver = {
  userId: "driver-001",
  name: "Kwame Mensah",
  email: "kwame@knust.edu.gh",
  role: "DRIVER",
  assignedRouteId: "route-A",
  shuttleId: "shuttle-001",
};


// ─── ROUTES ──────────────────────────────────────────────────
export const routes: Route[] = [
  {
    routeId: "route-A",
    name: "Route A — Main Gate",
    shortName: "Route A",
    color: "#1C6B2A",
    totalStops: 5,
    loopTimeMinutes: 12,
    stops: [
      { stopId: "stop-A1", name: "Main Gate",       latitude: 6.6745, longitude: -1.5716, order: 1 },
      { stopId: "stop-A2", name: "Unity Hall",       latitude: 6.6738, longitude: -1.5724, order: 2 },
      { stopId: "stop-A3", name: "SRC Bus Stop",     latitude: 6.6729, longitude: -1.5731, order: 3 },
      { stopId: "stop-A4", name: "Paa Joe Junction", latitude: 6.6720, longitude: -1.5719, order: 4 },
      { stopId: "stop-A5", name: "Main Gate",        latitude: 6.6745, longitude: -1.5716, order: 5 },
    ],
  },
  {
    routeId: "route-B",
    name: "Route B — Paa Joe",
    shortName: "Route B",
    color: "#E63946",
    totalStops: 4,
    loopTimeMinutes: 10,
    stops: [
      { stopId: "stop-B1", name: "Paa Joe Junction", latitude: 6.6720, longitude: -1.5719, order: 1 },
      { stopId: "stop-B2", name: "Science Building",  latitude: 6.6712, longitude: -1.5710, order: 2 },
      { stopId: "stop-B3", name: "Engineering Dept",  latitude: 6.6705, longitude: -1.5698, order: 3 },
      { stopId: "stop-B4", name: "Paa Joe Junction",  latitude: 6.6720, longitude: -1.5719, order: 4 },
    ],
  },
  {
    routeId: "route-C",
    name: "Route C — SRC",
    shortName: "Route C",
    color: "#6B7280",
    totalStops: 6,
    loopTimeMinutes: 15,
    stops: [
      { stopId: "stop-C1", name: "SRC Bus Stop",      latitude: 6.6729, longitude: -1.5731, order: 1 },
      { stopId: "stop-C2", name: "Brunei Hostel",     latitude: 6.6740, longitude: -1.5740, order: 2 },
      { stopId: "stop-C3", name: "Great Hall",        latitude: 6.6748, longitude: -1.5750, order: 3 },
      { stopId: "stop-C4", name: "University Library", latitude: 6.6755, longitude: -1.5745, order: 4 },
      { stopId: "stop-C5", name: "Pentagon Hostel",   latitude: 6.6762, longitude: -1.5735, order: 5 },
      { stopId: "stop-C6", name: "SRC Bus Stop",      latitude: 6.6729, longitude: -1.5731, order: 6 },
    ],
  },
];


// ─── SHUTTLES ─────────────────────────────────────────────────
export const shuttles: Shuttle[] = [
  {
    shuttleId: "shuttle-001",
    routeId: "route-A",
    routeName: "Route A — Main Gate",
    driverId: "driver-001",
    status: "HAS_SPACE",
    latitude: 6.6741,
    longitude: -1.5720,
    etaMinutes: 4,
    lastUpdated: "Just now",
  },
  {
    shuttleId: "shuttle-002",
    routeId: "route-B",
    routeName: "Route B — Paa Joe",
    driverId: "driver-002",
    status: "FULL",
    latitude: 6.6712,
    longitude: -1.5698,
    etaMinutes: 9,
    lastUpdated: "30 seconds ago",
  },
  {
    shuttleId: "shuttle-003",
    routeId: "route-C",
    routeName: "Route C — SRC",
    driverId: null,
    status: "INACTIVE",
    latitude: 6.6729,
    longitude: -1.5731,
    etaMinutes: null,
    lastUpdated: "10 min ago",
  },
];


// ─── NOTIFICATIONS ────────────────────────────────────────────
export const notifications: AppNotification[] = [
  {
    notificationId: "notif-001",
    title: "Route A delayed by 5 min",
    message:
      "The shuttle on the Main Gate route is currently running approximately 5 minutes behind schedule due to heavy traffic near the Engineering faculty. We apologise for the inconvenience.",
    affectedRouteId: "route-A",
    affectedRouteName: "Route A — Main Gate",
    type: "DELAY",
    isRead: false,
    sentAt: "2026-05-09T08:30:00",
    timeAgo: "2 min ago",
  },
  {
    notificationId: "notif-002",
    title: "Route B is now full",
    message:
      "The Paa Joe route shuttle is currently at full capacity. Please wait for the next available shuttle or consider an alternative route.",
    affectedRouteId: "route-B",
    affectedRouteName: "Route B — Paa Joe",
    type: "STATUS",
    isRead: false,
    sentAt: "2026-05-09T08:17:00",
    timeAgo: "15 min ago",
  },
  {
    notificationId: "notif-003",
    title: "Service resumes at 7am",
    message:
      "All shuttle routes will be fully operational from Monday morning at 7:00am. Have a restful weekend.",
    affectedRouteId: null,
    affectedRouteName: null,
    type: "GENERAL",
    isRead: true,
    sentAt: "2026-05-08T18:00:00",
    timeAgo: "Yesterday",
  },
  {
    notificationId: "notif-004",
    title: "Route C back online",
    message:
      "The SRC route shuttle is now active after maintenance. Normal service has resumed on all stops.",
    affectedRouteId: "route-C",
    affectedRouteName: "Route C — SRC",
    type: "STATUS",
    isRead: true,
    sentAt: "2026-05-07T10:00:00",
    timeAgo: "2 days ago",
  },
  {
    notificationId: "notif-005",
    title: "Exam period schedule change",
    message:
      "During the upcoming exam period, shuttle services will run extended hours from 6:00am to 10:00pm on all routes.",
    affectedRouteId: null,
    affectedRouteName: null,
    type: "GENERAL",
    isRead: true,
    sentAt: "2026-05-05T09:00:00",
    timeAgo: "4 days ago",
  },
];


// ─── WALK OR WAIT HELPERS ─────────────────────────────────────
export const WALKING_SPEED_KMH = 5;

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getWalkOrWaitRecommendation(
  studentLat: number,
  studentLng: number,
  destinationStop: Stop,
  shuttle: Shuttle | null
): WalkOrWaitRecommendation {
  const distanceKm = calculateDistanceKm(
    studentLat,
    studentLng,
    destinationStop.latitude,
    destinationStop.longitude
  );
  const walkingTimeMinutes = (distanceKm / WALKING_SPEED_KMH) * 60;
  const shuttleEta = shuttle ? shuttle.etaMinutes : null;

  if (!shuttleEta || !shuttle || shuttle.status === "FULL" || shuttle.status === "INACTIVE") {
    return {
      recommendation: "WALK",
      walkingTimeMinutes: Math.round(walkingTimeMinutes),
      shuttleEta: null,
      reason: "No available shuttle",
    };
  }

  return {
    recommendation: shuttleEta < walkingTimeMinutes ? "WAIT" : "WALK",
    walkingTimeMinutes: Math.round(walkingTimeMinutes),
    shuttleEta,
    distanceMeters: Math.round(distanceKm * 1000),
  };
}


// ─── ERROR / EMPTY STATE FLAGS ────────────────────────────────
export const isNetworkError: boolean = false;
export const isNoShuttlesActive: boolean = false;
export const isDriverOffline: boolean = false;


// ─── CAMPUS MAP CONFIG ────────────────────────────────────────
export const CAMPUS_MAP_CENTER: MapRegion = {
  latitude: 6.6736,
  longitude: -1.5727,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};