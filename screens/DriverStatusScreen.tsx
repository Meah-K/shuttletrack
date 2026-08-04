import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import type { StackNavigationProp } from '@react-navigation/stack';
import { updateShuttleLocation, updateShuttleStatus, getUser } from '../utils/api';

// TEMPORARY: hardcoded until there's a real driver->shuttle assignment endpoint.
// Add the other two driver emails here once you have them from Marvelle.
const DRIVER_SHUTTLE_MAP: Record<string, string> = {
  'salma@st.knust.edu.gh': 'a1b2c3d4-e5f6-4789-a012-3456789abcde', // Route A
};

type ShuttleStatus = 'HAS_SPACE' | 'FULL';

type RootStackParamList = {
  DriverStatus: undefined;
  DriverProfile: undefined;
};

type DriverStatusNavigationProp = StackNavigationProp<RootStackParamList, 'DriverStatus'>;

interface DriverStatusScreenProps {
  navigation: DriverStatusNavigationProp;
}

export default function DriverStatusScreen({ navigation }: DriverStatusScreenProps): React.JSX.Element {
  const [status, setStatus] = useState<ShuttleStatus>('HAS_SPACE');
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [gpsError, setGpsError] = useState<string>('');
  const [shuttleId, setShuttleId] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const lastUpdateTimeRef = useRef<number>(Date.now());

  // ─── Load the driver's assigned shuttle ID ──────────────────
  useEffect(() => {
    async function loadShuttleId() {
      const user = await getUser();
      if (user?.email && DRIVER_SHUTTLE_MAP[user.email]) {
        setShuttleId(DRIVER_SHUTTLE_MAP[user.email]);
      } else {
        setGpsError('No shuttle assigned to this driver account');
      }
    }
    loadShuttleId();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // ─── GPS tracking — waits until shuttleId is loaded ─────────
  useEffect(() => {
    if (!shuttleId) return;

    let locationInterval: ReturnType<typeof setInterval>;
    let displayInterval: ReturnType<typeof setInterval>;

    async function startTracking() {
      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== 'granted') {
        setGpsError('Location permission denied — student app cannot track this shuttle');
        return;
      }

      async function sendLocationUpdate() {
        try {
          const position = await Location.getCurrentPositionAsync({});
          await updateShuttleLocation(
            shuttleId as string,
            position.coords.latitude,
            position.coords.longitude
          );
          lastUpdateTimeRef.current = Date.now();
          setLastUpdated('Just now');
          setGpsError('');
        } catch (err) {
          setGpsError('Could not update location');
        }
      }

      sendLocationUpdate();
      locationInterval = setInterval(sendLocationUpdate, 5000);
    }

    startTracking();

    displayInterval = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdateTimeRef.current) / 1000);
      setLastUpdated(secondsAgo < 5 ? 'Just now' : `${secondsAgo}s ago`);
    }, 1000);

    return () => {
      clearInterval(locationInterval);
      clearInterval(displayInterval);
    };
  }, [shuttleId]);

  async function toggleStatus(): Promise<void> {
    if (!shuttleId) {
      Alert.alert('No shuttle assigned', 'This driver account has no shuttle assigned yet.');
      return;
    }

    const newStatus: ShuttleStatus = status === 'HAS_SPACE' ? 'FULL' : 'HAS_SPACE';
    const previousStatus = status;

    setStatus(newStatus);

    try {
      await updateShuttleStatus(shuttleId, newStatus);
    } catch (err) {
      setStatus(previousStatus);
      Alert.alert('Update failed', 'Could not update shuttle status. Please try again.');
    }
  }

  const isAvailable = status === 'HAS_SPACE';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isAvailable ? '#1C6B2A' : '#E63946' }]}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('DriverProfile')}
      >
        <Ionicons name="person-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.inner}>
        <TouchableOpacity onPress={toggleStatus} activeOpacity={0.9}>
          <Animated.View style={[styles.outerRing, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.innerCircle}>
              <Text style={[styles.statusText, { color: isAvailable ? '#1C6B2A' : '#E63946' }]}>
                {isAvailable ? 'HAS\nSPACE' : 'FULL'}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.hintText}>
          {isAvailable ? 'Tap to mark as full' : 'Tap to mark as available'}
        </Text>

        <View style={styles.gpsBanner}>
          <View style={[styles.gpsDot, gpsError ? styles.gpsDotError : undefined]} />
          <Text style={styles.gpsText}>
            {gpsError ? gpsError : `GPS active · Route A · ${lastUpdated}`}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileButton: { position: 'absolute', top: 56, right: 24, width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  outerRing: { width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  innerCircle: { width: 152, height: 152, borderRadius: 76, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  statusText: { fontSize: 20, fontWeight: '800', textAlign: 'center', letterSpacing: 1 },
  hintText: { fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  gpsBanner: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  gpsDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#90EE90' },
  gpsDotError: { backgroundColor: '#FFD700' },
  gpsText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
});