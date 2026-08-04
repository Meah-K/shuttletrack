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
import type { Shuttle, ShuttleStatus, Route, Stop } from '../mockData';
import { getRoutes, getEta } from '../utils/api';

type RootStackParamList = {
  ShuttleDetail: { shuttle: Shuttle };
  WalkOrWait: { shuttle: Shuttle };
};

type ShuttleDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ShuttleDetail'>;
type ShuttleDetailRouteProp = RouteProp<RootStackParamList, 'ShuttleDetail'>;

interface ShuttleDetailScreenProps {
  navigation: ShuttleDetailNavigationProp;
  route: ShuttleDetailRouteProp;
}

interface StopWithEta extends Stop {
  etaMinutes: number | null;
}

function getStatusLabel(status: ShuttleStatus): string {
  if (status === 'HAS_SPACE') return 'Has space';
  if (status === 'FULL') return 'Full';
  return 'Inactive';
}

function getStatusColor(status: ShuttleStatus): string {
  if (status === 'HAS_SPACE') return '#1C6B2A';
  if (status === 'FULL') return '#E63946';
  return '#6B7280';
}

function getStatusBg(status: ShuttleStatus): string {
  if (status === 'HAS_SPACE') return '#EAF5EC';
  if (status === 'FULL') return '#FFF0F0';
  return '#F3F4F6';
}

export default function ShuttleDetailScreen({ navigation, route }: ShuttleDetailScreenProps): React.JSX.Element {
  const { shuttle } = route.params;

  const [stopsWithEta, setStopsWithEta] = useState<StopWithEta[]>([]);
  const [stopsLoading, setStopsLoading] = useState(true);
  const [stopsError, setStopsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStops() {
      setStopsLoading(true);
      setStopsError(null);
      try {
        const allRoutes: Route[] = await getRoutes();
        const matchedRoute = allRoutes.find(r => r.routeId === shuttle.routeId);

        if (!matchedRoute) {
          if (isMounted) setStopsError('Could not find stops for this route.');
          return;
        }

        const uniqueStops = matchedRoute.stops.filter(
          (stop, index, all) => all.findIndex(s => s.name === stop.name) === index
        );

        if (shuttle.status !== 'HAS_SPACE') {
          if (isMounted) {
            setStopsWithEta(uniqueStops.map(stop => ({ ...stop, etaMinutes: null })));
          }
          return;
        }

        const withEta = await Promise.all(
          uniqueStops.map(async (stop) => {
            try {
              const eta = await getEta(stop.stopId, shuttle.routeId);
              return { ...stop, etaMinutes: eta?.etaMinutes ?? null };
            } catch {
              return { ...stop, etaMinutes: null };
            }
          })
        );

        if (isMounted) setStopsWithEta(withEta);
      } catch {
        if (isMounted) setStopsError('Could not load stops — check your connection.');
      } finally {
        if (isMounted) setStopsLoading(false);
      }
    }

    loadStops();
    return () => {
      isMounted = false;
    };
  }, [shuttle.routeId, shuttle.status]);

  const nextStopEta = stopsWithEta.length > 0 ? stopsWithEta[0].etaMinutes : shuttle.etaMinutes;
  const stopsRemaining = stopsWithEta.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{shuttle.routeName}</Text>
          <Text style={styles.headerSub}>Shuttle #{shuttle.shuttleId}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: getStatusBg(shuttle.status) }]}>
          <Text style={[styles.statusPillText, { color: getStatusColor(shuttle.status) }]}>
            {getStatusLabel(shuttle.status)}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.etaHero}>
          <View style={styles.etaLeft}>
            <Text style={styles.etaLabel}>NEXT ARRIVAL</Text>
            <Text style={styles.etaValue}>
              {nextStopEta ? `${nextStopEta} min` : 'N/A'}
            </Text>
            <Text style={styles.etaUpdated}>Updated {shuttle.lastUpdated}</Text>
          </View>
          <Ionicons name="bus" size={64} color="rgba(255,255,255,0.2)" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming stops</Text>

          {stopsLoading ? (
            <View style={styles.loadingBox}>
              <Ionicons name="reload" size={28} color="#1C6B2A" />
              <Text style={styles.loadingText}>Loading stops...</Text>
            </View>
          ) : stopsError || stopsWithEta.length === 0 ? (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={16} color="#B45309" />
              <Text style={styles.warningText}>{stopsError ?? 'No stops found for this route.'}</Text>
            </View>
          ) : (
            stopsWithEta.map((stop, index) => (
              <View style={styles.stopRow} key={stop.stopId}>
                <View style={styles.stopIndicator}>
                  <View style={index === 0 ? styles.stopDotActive : styles.stopDot} />
                  {index < stopsWithEta.length - 1 && <View style={styles.stopLine} />}
                </View>
                <View style={styles.stopContent}>
                  <Text style={index === 0 ? styles.stopName : styles.stopNameMuted}>
                    {stop.name}
                  </Text>
                  {index === 0 && <Text style={styles.stopType}>Next stop</Text>}
                </View>
                <Text style={index === 0 ? styles.stopEtaActive : styles.stopEta}>
                  {stop.etaMinutes !== null ? `${stop.etaMinutes} min` : 'N/A'}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="location" size={20} color="#1C6B2A" />
            <Text style={styles.infoValue}>On route</Text>
            <Text style={styles.infoLabel}>Status</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color="#1C6B2A" />
            <Text style={styles.infoValue}>{shuttle.lastUpdated}</Text>
            <Text style={styles.infoLabel}>Last updated</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="bus" size={20} color="#1C6B2A" />
            <Text style={styles.infoValue}>{stopsRemaining} stops</Text>
            <Text style={styles.infoLabel}>Remaining</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('WalkOrWait', { shuttle })}
        >
          <Ionicons name="walk" size={20} color="#FFFFFF" />
          <Text style={styles.ctaText}>Walk or Wait?</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC', gap: 12 },
  backButton: { width: 36, height: 36, backgroundColor: '#F7F8F5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  headerSub: { fontSize: 12, color: '#6B7280' },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 50 },
  statusPillText: { fontSize: 12, fontWeight: '700' },
  etaHero: { backgroundColor: '#1C6B2A', margin: 16, borderRadius: 20, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  etaLeft: { gap: 4 },
  etaLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.8 },
  etaValue: { fontSize: 48, fontWeight: '800', color: '#FFFFFF', lineHeight: 56 },
  etaUpdated: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  section: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
  stopRow: { flexDirection: 'row', gap: 12, minHeight: 44 },
  stopIndicator: { width: 12, alignItems: 'center' },
  stopDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#D0D0CC', marginTop: 4 },
  stopDotActive: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1C6B2A', marginTop: 4 },
  stopLine: { width: 2, flex: 1, backgroundColor: '#E0E0DC', marginTop: 4 },
  stopContent: { flex: 1, gap: 2, paddingBottom: 12 },
  stopName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  stopNameMuted: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  stopType: { fontSize: 11, color: '#9CA3AF' },
  stopEta: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  stopEtaActive: { fontSize: 13, color: '#1C6B2A', fontWeight: '600', marginTop: 4 },
  loadingBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24, gap: 8 },
  loadingText: { fontSize: 13, color: '#6B7280' },
  warningBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', borderRadius: 12, borderWidth: 0.5, borderColor: '#FCD34D', padding: 12 },
  warningText: { fontSize: 12, color: '#92400E', flex: 1 },
  infoRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 16 },
  infoCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 14, alignItems: 'center', gap: 4 },
  infoValue: { fontSize: 12, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  infoLabel: { fontSize: 10, color: '#6B7280', textAlign: 'center' },
  ctaButton: { backgroundColor: '#1C6B2A', borderRadius: 50, paddingVertical: 16, marginHorizontal: 16, marginBottom: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});