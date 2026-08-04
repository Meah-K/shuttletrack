import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { calculateDistanceKm, WALKING_SPEED_KMH } from '../mockData';
import type { Shuttle, Stop, Route, WalkOrWaitResult } from '../mockData';
import { getEta, getRoutes } from '../utils/api';

type RootStackParamList = {
  WalkOrWait: { shuttle: Shuttle };
};

type WalkOrWaitNavigationProp = StackNavigationProp<RootStackParamList, 'WalkOrWait'>;
type WalkOrWaitRouteProp = RouteProp<RootStackParamList, 'WalkOrWait'>;

interface WalkOrWaitScreenProps {
  navigation: WalkOrWaitNavigationProp;
  route: WalkOrWaitRouteProp;
}

interface Recommendation {
  recommendation: WalkOrWaitResult;
  walkingTime: number;
  shuttleEta: number | null;
  distanceMeters: number;
  nearestStopName: string;
  wouldMissShuttle: boolean;
}

const FALLBACK_STOP: Stop = {
  stopId: 'default',
  name: 'Main Gate',
  latitude: 6.6745,
  longitude: -1.5716,
  order: 1,
};

export default function WalkOrWaitScreen({ navigation, route }: WalkOrWaitScreenProps): React.JSX.Element {
  const { shuttle } = route.params;
  const [destination, setDestination] = useState<Stop | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [shuttleRoute, setShuttleRoute] = useState<Route | null>(null);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setRoutesLoading(true);
      setRoutesError(null);
      try {
        const allRoutes = await getRoutes();
        const matched = allRoutes.find(r => r.routeId === shuttle.routeId) ?? null;
        setShuttleRoute(matched);
        if (!matched) setRoutesError('Could not find stops for this route.');
      } catch {
        setRoutesError('Could not load stops — check your connection.');
      } finally {
        setRoutesLoading(false);
      }
    })();
  }, [shuttle.routeId]);

  const destinationOptions: Stop[] = (shuttleRoute?.stops ?? []).filter(
    (stop, index, all) => all.findIndex(s => s.name === stop.name) === index
  );

  useEffect(() => {
    if (destination) {
      calculate();
    }
  }, [destination]);

  function findNearestStop(studentLat: number, studentLng: number): Stop {
    const stops = shuttleRoute?.stops ?? [];
    if (stops.length === 0) return FALLBACK_STOP;

    return stops.reduce((nearest, current) => {
      const nearestDist = calculateDistanceKm(studentLat, studentLng, nearest.latitude, nearest.longitude);
      const currentDist = calculateDistanceKm(studentLat, studentLng, current.latitude, current.longitude);
      return currentDist < nearestDist ? current : nearest;
    }, stops[0]);
  }

 async function buildRecommendation(studentLat: number, studentLng: number): Promise<void> {
  if (!destination) return;

  const nearestStop = findNearestStop(studentLat, studentLng);

  const distanceKm = calculateDistanceKm(studentLat, studentLng, destination.latitude, destination.longitude);
  const walkingTime = Math.max(Math.round((distanceKm / WALKING_SPEED_KMH) * 60), 1);

  // Walking time to the nearest stop — needed to check whether the student
  // can actually reach it before the shuttle does.
  const nearestStopDistanceKm = calculateDistanceKm(
    studentLat, studentLng, nearestStop.latitude, nearestStop.longitude
  );
  const walkingTimeToNearestStop = Math.max(Math.round((nearestStopDistanceKm / WALKING_SPEED_KMH) * 60), 1);

  let shuttleUnavailable = shuttle.status === 'FULL' || shuttle.status === 'INACTIVE';
  let shuttleEta: number | null = null;
  let etaToNearestStop: number | null = null;
  let wouldMissShuttle = false;

  if (!shuttleUnavailable) {
    try {
      const [destEtaResult, nearestEtaResult] = await Promise.all([
        getEta(destination.stopId, shuttle.routeId),
        getEta(nearestStop.stopId, shuttle.routeId),
      ]);
      shuttleEta = destEtaResult?.etaMinutes ?? null;
      etaToNearestStop = nearestEtaResult?.etaMinutes ?? null;

      if (shuttleEta === null || etaToNearestStop === null) {
        shuttleUnavailable = true;
      } else if (walkingTimeToNearestStop > etaToNearestStop) {
        wouldMissShuttle = true;
      }
    } catch {
      shuttleUnavailable = true;
    }
  }

  const canWait = !shuttleUnavailable && !wouldMissShuttle && shuttleEta !== null;

  setRecommendation({
    recommendation: canWait && shuttleEta! < walkingTime ? 'WAIT' : 'WALK',
    walkingTime,
    shuttleEta,
    distanceMeters: Math.max(Math.round(distanceKm * 1000), 100),
    nearestStopName: nearestStop.name,
    wouldMissShuttle,
  });
}

  async function calculate(): Promise<void> {
    setLocationError(null);
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Location permission denied — showing estimate from default location.');
        await buildRecommendation(FALLBACK_STOP.latitude, FALLBACK_STOP.longitude);
        setLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      await buildRecommendation(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      setLocationError('Could not get your location — showing estimate from default location.');
      await buildRecommendation(FALLBACK_STOP.latitude, FALLBACK_STOP.longitude);
    } finally {
      setLoading(false);
    }
  }

  const isWait = recommendation?.recommendation === 'WAIT';

  if (!destination) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Where are you going?</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.inner}>
          <Text style={styles.pickerSubtitle}>
            Pick your destination on {shuttle.routeName} to compare walking vs waiting.
          </Text>

          {routesLoading ? (
            <View style={styles.loadingBox}>
              <Ionicons name="reload" size={32} color="#1C6B2A" />
              <Text style={styles.loadingText}>Loading stops...</Text>
            </View>
          ) : routesError || destinationOptions.length === 0 ? (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={16} color="#B45309" />
              <Text style={styles.warningText}>{routesError ?? 'No stops found for this route.'}</Text>
            </View>
          ) : (
            destinationOptions.map(stop => (
              <TouchableOpacity
                key={stop.stopId}
                style={styles.destOption}
                onPress={() => setDestination(stop)}
              >
                <View style={styles.destOptionIcon}>
                  <Ionicons name="location-outline" size={18} color="#1C6B2A" />
                </View>
                <Text style={styles.destOptionText}>{stop.name}</Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setDestination(null)}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Walk or Wait?</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.inner}>
        <View style={styles.shuttleCard}>
          <View style={styles.shuttleIconBox}>
            <Ionicons name="bus" size={24} color="#1C6B2A" />
          </View>
          <View style={styles.shuttleInfo}>
            <Text style={styles.shuttleName}>{shuttle.routeName}</Text>
            <Text style={styles.shuttleSub}>
              {shuttle.status === 'HAS_SPACE' ? 'Has space · arriving soon' :
               shuttle.status === 'FULL' ? 'Currently full' : 'Inactive'}
            </Text>
          </View>
          <View style={[styles.shuttleBadge, { backgroundColor: shuttle.status === 'HAS_SPACE' ? '#EAF5EC' : '#FFF0F0' }]}>
            <Text style={[styles.shuttleBadgeText, { color: shuttle.status === 'HAS_SPACE' ? '#1C6B2A' : '#E63946' }]}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes} min` : 'N/A'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.destinationBanner} onPress={() => setDestination(null)}>
          <Ionicons name="flag-outline" size={16} color="#1C6B2A" />
          <Text style={styles.destinationBannerText}>
            Going to <Text style={styles.stopInfoBold}>{destination.name}</Text>
          </Text>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>

        {locationError ? (
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={16} color="#B45309" />
            <Text style={styles.warningText}>{locationError}</Text>
          </View>
        ) : null}

        {recommendation && !loading ? (
          <View>
            <View style={[styles.resultHero, { backgroundColor: isWait ? '#1C6B2A' : '#E63946' }]}>
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>RECOMMENDATION</Text>
                <Text style={styles.resultValue}>{isWait ? 'Wait' : 'Walk'}</Text>
                <Text style={styles.resultSub}>
                  {isWait
                    ? `Shuttle reaches ${destination.name} in ${recommendation.shuttleEta} min`
                    : `${recommendation.walkingTime} min on foot to ${destination.name}`}
                </Text>
              </View>
              <Ionicons name={isWait ? 'time-outline' : 'walk-outline'} size={64} color="rgba(255,255,255,0.2)" />
            </View>

            <View style={styles.comparisonRow}>
              <View style={[styles.compCard, !isWait && styles.compCardActive]}>
                <View style={[styles.compIconBox, { backgroundColor: !isWait ? '#E63946' : '#F7F8F5' }]}>
                  <Ionicons name="walk" size={22} color={!isWait ? '#FFFFFF' : '#6B7280'} />
                </View>
                <Text style={styles.compTitle}>Walking</Text>
                <Text style={[styles.compTime, { color: !isWait ? '#E63946' : '#1A1A1A' }]}>
                  {recommendation.walkingTime} min
                </Text>
                <Text style={styles.compSub}>~{recommendation.distanceMeters}m to {destination.name}</Text>
              </View>

              <View style={styles.vsDivider}>
                <Text style={styles.vsText}>VS</Text>
              </View>

              <View style={[styles.compCard, isWait && styles.compCardActive]}>
                <View style={[styles.compIconBox, { backgroundColor: isWait ? '#1C6B2A' : '#F7F8F5' }]}>
                  <Ionicons name="bus" size={22} color={isWait ? '#FFFFFF' : '#6B7280'} />
                </View>
                <Text style={styles.compTitle}>Shuttle</Text>
                <Text style={[styles.compTime, { color: isWait ? '#1C6B2A' : '#1A1A1A' }]}>
                  {recommendation.shuttleEta !== null ? `${recommendation.shuttleEta} min` : 'N/A'}
                </Text>
                <Text style={styles.compSub}>
                  {shuttle.status === 'HAS_SPACE' ? 'Has space' : 'No space'}
                </Text>
              </View>
            </View>

            <View style={styles.stopInfo}>
              <Ionicons name="location" size={16} color="#1C6B2A" />
              <Text style={styles.stopInfoText}>
                Nearest stop to you: <Text style={styles.stopInfoBold}>{recommendation.nearestStopName}</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.recalcButton} onPress={() => calculate()}>
              <Ionicons name="refresh" size={16} color="#1C6B2A" />
              <Text style={styles.recalcText}>Recalculate</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loadingBox}>
            <Ionicons name="reload" size={32} color="#1C6B2A" />
            <Text style={styles.loadingText}>Calculating...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC' },
  backButton: { width: 36, height: 36, backgroundColor: '#F7F8F5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  inner: { padding: 16 },
  pickerSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 19 },
  destOption: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 14, marginBottom: 10 },
  destOptionIcon: { width: 36, height: 36, backgroundColor: '#EAF5EC', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  destOptionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  destinationBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EAF5EC', borderRadius: 12, padding: 12, marginBottom: 16 },
  destinationBannerText: { flex: 1, fontSize: 13, color: '#1A1A1A' },
  changeText: { fontSize: 12, fontWeight: '700', color: '#1C6B2A' },
  shuttleCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  shuttleIconBox: { width: 44, height: 44, backgroundColor: '#EAF5EC', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shuttleInfo: { flex: 1, gap: 3 },
  shuttleName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  shuttleSub: { fontSize: 12, color: '#6B7280' },
  shuttleBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 50 },
  shuttleBadgeText: { fontSize: 13, fontWeight: '700' },
  warningBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', borderRadius: 12, borderWidth: 0.5, borderColor: '#FCD34D', padding: 12, marginBottom: 16 },
  warningText: { fontSize: 12, color: '#92400E', flex: 1 },
  resultHero: { borderRadius: 20, padding: 24, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultContent: { gap: 6, flex: 1 },
  resultLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  resultValue: { fontSize: 52, fontWeight: '800', color: '#FFFFFF', lineHeight: 60 },
  resultSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  comparisonRow: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'center' },
  compCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 16, alignItems: 'center', gap: 6 },
  compCardActive: { borderWidth: 2, borderColor: '#1C6B2A' },
  compIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  compTitle: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  compTime: { fontSize: 22, fontWeight: '800' },
  compSub: { fontSize: 11, color: '#9CA3AF', textAlign: 'center' },
  vsDivider: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F7F8F5', borderWidth: 1, borderColor: '#E0E0DC', alignItems: 'center', justifyContent: 'center' },
  vsText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  stopInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 12, marginBottom: 12 },
  stopInfoText: { fontSize: 13, color: '#6B7280' },
  stopInfoBold: { fontWeight: '700', color: '#1A1A1A' },
  recalcButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#1C6B2A', borderRadius: 50, paddingVertical: 14, marginBottom: 32 },
  recalcText: { fontSize: 15, fontWeight: '700', color: '#1C6B2A' },
  loadingBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  loadingText: { fontSize: 15, color: '#6B7280' },
});