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
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { routes, calculateDistanceKm, WALKING_SPEED_KMH } from '../mockData';
import type { Shuttle, Stop, WalkOrWaitResult } from '../mockData';

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
  stopName: string;
}

export default function WalkOrWaitScreen({ navigation, route }: WalkOrWaitScreenProps): React.JSX.Element {
  const { shuttle } = route.params;
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const shuttleRoute = routes.find(r => r.routeId === shuttle.routeId);

  useEffect(() => {
    const stop: Stop = shuttleRoute?.stops[0] ?? {
      stopId: 'default',
      name: 'KSB',
      latitude: 6.6745,
      longitude: -1.5716,
      order: 1,
    };
    calculate(stop);
  }, [shuttle]);

  function calculate(stop: Stop): void {
    const studentLat = 6.6736;
    const studentLng = -1.5727;

    const distanceKm = calculateDistanceKm(studentLat, studentLng, stop.latitude, stop.longitude);
    const walkingTime = Math.max(Math.round((distanceKm / WALKING_SPEED_KMH) * 60), 1);
    const shuttleEta = shuttle.etaMinutes;
    const isUnavailable = !shuttleEta || shuttle.status === 'FULL' || shuttle.status === 'INACTIVE';

    setRecommendation({
      recommendation: isUnavailable ? 'WALK' : shuttleEta < walkingTime ? 'WAIT' : 'WALK',
      walkingTime,
      shuttleEta: shuttleEta ?? null,
      distanceMeters: Math.max(Math.round(distanceKm * 1000), 100),
      stopName: stop.name,
    });
  }

  const isWait = recommendation?.recommendation === 'WAIT';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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

        {recommendation ? (
          <View>
            <View style={[styles.resultHero, { backgroundColor: isWait ? '#1C6B2A' : '#E63946' }]}>
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>RECOMMENDATION</Text>
                <Text style={styles.resultValue}>{isWait ? 'Wait' : 'Walk'}</Text>
                <Text style={styles.resultSub}>
                  {isWait
                    ? `Shuttle arrives in ${recommendation.shuttleEta} min`
                    : `${recommendation.walkingTime} min on foot`}
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
                <Text style={styles.compSub}>~{recommendation.distanceMeters}m</Text>
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
                  {recommendation.shuttleEta ? `${recommendation.shuttleEta} min` : 'N/A'}
                </Text>
                <Text style={styles.compSub}>
                  {shuttle.status === 'HAS_SPACE' ? 'Has space' : 'No space'}
                </Text>
              </View>
            </View>

            <View style={styles.stopInfo}>
              <Ionicons name="location" size={16} color="#1C6B2A" />
              <Text style={styles.stopInfoText}>
                Nearest stop: <Text style={styles.stopInfoBold}>{recommendation.stopName}</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.recalcButton}
              onPress={() => {
                const stop: Stop = shuttleRoute?.stops[0] ?? {
                  stopId: 'default',
                  name: 'KSB',
                  latitude: 6.6745,
                  longitude: -1.5716,
                  order: 1,
                };
                calculate(stop);
              }}
            >
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
  shuttleCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  shuttleIconBox: { width: 44, height: 44, backgroundColor: '#EAF5EC', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shuttleInfo: { flex: 1, gap: 3 },
  shuttleName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  shuttleSub: { fontSize: 12, color: '#6B7280' },
  shuttleBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 50 },
  shuttleBadgeText: { fontSize: 13, fontWeight: '700' },
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