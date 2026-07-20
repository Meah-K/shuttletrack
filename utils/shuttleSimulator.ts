// ============================================================
// ShuttleTrack — shuttleSimulator.ts
// Simulates live shuttle movement around KNUST campus
// ============================================================

import { Shuttle, Route, ShuttleStatus } from '../mockData';

// GPS waypoints for each route — shuttles follow these paths
const ROUTE_WAYPOINTS: Record<string, { latitude: number; longitude: number }[]> = {
  'route-A': [
    { latitude: 6.6745, longitude: -1.5716 }, // Main Gate
    { latitude: 6.6741, longitude: -1.5720 }, // Between stops
    { latitude: 6.6738, longitude: -1.5724 }, // Unity Hall
    { latitude: 6.6733, longitude: -1.5728 }, // Between stops
    { latitude: 6.6729, longitude: -1.5731 }, // SRC Bus Stop
    { latitude: 6.6724, longitude: -1.5725 }, // Between stops
    { latitude: 6.6720, longitude: -1.5719 }, // Paa Joe Junction
    { latitude: 6.6730, longitude: -1.5717 }, // Heading back
    { latitude: 6.6738, longitude: -1.5716 }, // Almost back
    { latitude: 6.6745, longitude: -1.5716 }, // Main Gate again
  ],
  'route-B': [
    { latitude: 6.6720, longitude: -1.5719 }, // Paa Joe Junction
    { latitude: 6.6716, longitude: -1.5714 }, // Between stops
    { latitude: 6.6712, longitude: -1.5710 }, // Science Building
    { latitude: 6.6708, longitude: -1.5704 }, // Between stops
    { latitude: 6.6705, longitude: -1.5698 }, // Engineering Dept
    { latitude: 6.6709, longitude: -1.5703 }, // Heading back
    { latitude: 6.6714, longitude: -1.5710 }, // Between stops
    { latitude: 6.6720, longitude: -1.5719 }, // Paa Joe Junction again
  ],
  'route-C': [
    { latitude: 6.6729, longitude: -1.5731 }, // SRC Bus Stop
    { latitude: 6.6734, longitude: -1.5736 }, // Between stops
    { latitude: 6.6740, longitude: -1.5740 }, // Brunei Hostel
    { latitude: 6.6744, longitude: -1.5745 }, // Between stops
    { latitude: 6.6748, longitude: -1.5750 }, // Great Hall
    { latitude: 6.6751, longitude: -1.5748 }, // Between stops
    { latitude: 6.6755, longitude: -1.5745 }, // University Library
    { latitude: 6.6759, longitude: -1.5740 }, // Between stops
    { latitude: 6.6762, longitude: -1.5735 }, // Pentagon Hostel
    { latitude: 6.6756, longitude: -1.5732 }, // Heading back
    { latitude: 6.6742, longitude: -1.5731 }, // Between stops
    { latitude: 6.6729, longitude: -1.5731 }, // SRC Bus Stop again
  ],
};

// Track current waypoint index for each shuttle
const shuttleWaypointIndex: Record<string, number> = {
  'shuttle-001': 0,
  'shuttle-002': 3,
  'shuttle-003': 1,
};

// Calculate ETA based on waypoints remaining
function calculateETA(
  routeId: string,
  currentIndex: number,
  totalWaypoints: number
): number {
  const remaining = totalWaypoints - currentIndex;
  // Each waypoint takes about 1 minute
  return Math.max(1, Math.round(remaining * 0.8));
}

// Move all shuttles one step forward along their routes
export function moveShuttles(shuttles: Shuttle[]): Shuttle[] {
  return shuttles.map(shuttle => {
    if (shuttle.status === 'INACTIVE') return shuttle;

    const waypoints = ROUTE_WAYPOINTS[shuttle.routeId];
    if (!waypoints) return shuttle;

    // Get current index and advance it
    const currentIndex = shuttleWaypointIndex[shuttle.shuttleId] ?? 0;
    const nextIndex = (currentIndex + 1) % waypoints.length;
    shuttleWaypointIndex[shuttle.shuttleId] = nextIndex;

    const nextPosition = waypoints[nextIndex];
    const eta = calculateETA(shuttle.routeId, nextIndex, waypoints.length);

    return {
      ...shuttle,
      latitude: nextPosition.latitude,
      longitude: nextPosition.longitude,
      etaMinutes: eta,
      lastUpdated: 'Just now',
    };
  });
}

// Get a shuttle's current position interpolated between waypoints
export function getShuttlePosition(
  shuttleId: string,
  routeId: string
): { latitude: number; longitude: number } | null {
  const waypoints = ROUTE_WAYPOINTS[routeId];
  if (!waypoints) return null;

  const index = shuttleWaypointIndex[shuttleId] ?? 0;
  return waypoints[index];
}