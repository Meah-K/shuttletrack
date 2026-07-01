import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import GPSIndicator from '../../components/GPSIndicator';
import { trackingApi } from '../../lib/api';
import { clearSession } from '../../lib/tokenStorage';
import { colors, radius, spacing, typography } from '../../theme/colors';

type ShuttleStatus = 'HAS_SPACE' | 'FULL';

interface Props {
  navigation: { replace: (screen: string) => void };
  route: { params?: { shuttleId?: string } };
}

// How often GPS location is sent to the backend (in milliseconds)
const GPS_INTERVAL_MS = 10000; // 10 seconds

export default function DriverStatusScreen({ navigation, route }: Props) {
  const [status, setStatus] = useState<ShuttleStatus>('HAS_SPACE');
  const [gpsActive, setGpsActive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('...');
  const [statusLoading, setStatusLoading] = useState(false);

  // The shuttle ID comes from the login response (passed via navigation params)
  // Falls back to a placeholder until backend is fully wired
  const shuttleId = route?.params?.shuttleId ?? 'shuttle-id-placeholder';

  const gpsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── GPS Setup ───────────────────────────────────────────────
  useEffect(() => {
    startGPS();
    return () => stopGPS(); // Clean up when screen unmounts
  }, []);

  async function startGPS() {
    // Ask the user for location permission
    const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
    if (permStatus !== 'granted') {
      Alert.alert(
        'Location needed',
        'ShuttleTrack needs your location to share your position with students.',
        [{ text: 'OK' }]
      );
      return;
    }

    setGpsActive(true);

    // Send location immediately on login, then every 10 seconds
    await sendLocation();
    gpsIntervalRef.current = setInterval(sendLocation, GPS_INTERVAL_MS);
  }

  function stopGPS() {
    if (gpsIntervalRef.current) {
      clearInterval(gpsIntervalRef.current);
      gpsIntervalRef.current = null;
    }
    setGpsActive(false);
  }

  async function sendLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // 🔴 REAL API CALL — sends GPS to backend
      await trackingApi.updateLocation(shuttleId, latitude, longitude);

      // Update the "last updated" timestamp
      const now = new Date();
      setLastUpdated(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`);

    } catch (e) {
      // Silently fail — GPS errors shouldn't crash the screen
      console.warn('GPS update failed:', e);
    }
  }

  // ─── Status Toggle ───────────────────────────────────────────
  async function toggleStatus() {
    const next: ShuttleStatus = status === 'HAS_SPACE' ? 'FULL' : 'HAS_SPACE';

    setStatusLoading(true);
    try {
      // 🔴 REAL API CALL — updates shuttle status on backend
      await trackingApi.updateStatus(shuttleId, next);
      setStatus(next); // Only update UI if API call succeeded
    } catch (e) {
      Alert.alert('Error', 'Could not update status. Please try again.');
    } finally {
      setStatusLoading(false);
    }
  }

  // ─── Logout ──────────────────────────────────────────────────
  function handleLogout() {
    Alert.alert(
      'Log out?',
      'You will stop sharing GPS.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            stopGPS();
            await clearSession();
            navigation.replace('DriverLogin');
          },
        },
      ]
    );
  }

  // ─── UI ──────────────────────────────────────────────────────
  const isHasSpace = status === 'HAS_SPACE';
  const cardColor = isHasSpace ? colors.primary : colors.danger;
  const statusText = isHasSpace ? 'HAS SPACE' : 'FULL';

  return (
    <SafeAreaView style={styles.safe}>

      {/* Top bar — GPS indicator + Log out */}
      <View style={styles.topBar}>
        <GPSIndicator active={gpsActive} lastUpdated={lastUpdated} />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Full screen color card — tap to toggle */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={toggleStatus}
        disabled={statusLoading}
        style={[styles.card, { backgroundColor: cardColor }]}
      >
        <Text style={styles.statusText}>{statusLoading ? '...' : statusText}</Text>
        <Text style={styles.hint}>Tap to switch</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logoutButton: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  logoutText: { ...typography.bodyBold, color: colors.textSecondary },
  card: {
    flex: 1,
    margin: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    ...typography.display,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  hint: {
    ...typography.body,
    color: '#FFFFFF',
    marginTop: spacing.md,
    opacity: 0.85,
  },
});
