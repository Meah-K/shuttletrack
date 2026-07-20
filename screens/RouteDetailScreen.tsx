import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { Route, Shuttle, ShuttleStatus } from '../mockData';

type RootStackParamList = {
  RouteDetail: { route: Route; shuttle: Shuttle | undefined };
  WalkOrWait: { shuttle: Shuttle };
};

type RouteDetailNavigationProp = StackNavigationProp<RootStackParamList, 'RouteDetail'>;
type RouteDetailRouteProp = RouteProp<RootStackParamList, 'RouteDetail'>;

interface RouteDetailScreenProps {
  navigation: RouteDetailNavigationProp;
  route: RouteDetailRouteProp;
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

export default function RouteDetailScreen({ navigation, route }: RouteDetailScreenProps): React.JSX.Element {
  const { route: shuttleRoute, shuttle } = route.params;
  const status: ShuttleStatus = shuttle ? shuttle.status : 'INACTIVE';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{shuttleRoute.shortName}</Text>
          <Text style={styles.headerSub}>{shuttleRoute.totalStops} stops</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: getStatusBg(status) }]}>
          <Text style={[styles.statusPillText, { color: getStatusColor(status) }]}>
            {getStatusLabel(status)}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.etaHero}>
          <View style={styles.etaLeft}>
            <Text style={styles.etaLabel}>NEXT ARRIVAL</Text>
            <Text style={styles.etaValue}>
              {shuttle?.etaMinutes ? `${shuttle.etaMinutes} min` : 'N/A'}
            </Text>
            <Text style={styles.etaUpdated}>
              Updated {shuttle?.lastUpdated ?? 'recently'}
            </Text>
          </View>
          <View style={styles.etaRight}>
            <View style={styles.etaStat}>
              <Text style={styles.etaStatValue}>~{shuttleRoute.loopTimeMinutes}</Text>
              <Text style={styles.etaStatLabel}>min loop</Text>
            </View>
            <View style={styles.etaStatDivider} />
            <View style={styles.etaStat}>
              <Text style={styles.etaStatValue}>{shuttleRoute.totalStops}</Text>
              <Text style={styles.etaStatLabel}>stops</Text>
            </View>
          </View>
        </View>

        <View style={styles.miniMap}>
          <Ionicons name="map" size={32} color="#1C6B2A" />
          <Text style={styles.miniMapText}>Route map</Text>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All stops</Text>
          {shuttleRoute.stops.map((stop, index) => (
            <View key={stop.stopId}>
              <View style={styles.stopRow}>
                <View style={styles.stopLeft}>
                  <View style={[styles.stopDot, index === 0 && styles.stopDotActive]} />
                  {index < shuttleRoute.stops.length - 1 && <View style={styles.connector} />}
                </View>
                <View style={styles.stopContent}>
                  <Text style={[styles.stopName, index !== 0 && styles.stopNameMuted]}>
                    {stop.name}
                  </Text>
                  <Text style={styles.stopType}>
                    {index === 0 ? 'Starting point' :
                     index === shuttleRoute.stops.length - 1 ? 'End / loop back' :
                     `Stop ${index + 1}`}
                  </Text>
                </View>
                <Text style={[styles.stopEta, index === 0 && styles.stopEtaActive]}>
                  {shuttle?.etaMinutes ? `${shuttle.etaMinutes + index * 5} min` : 'N/A'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {shuttle && (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('WalkOrWait', { shuttle })}
          >
            <Ionicons name="walk" size={20} color="#FFFFFF" />
            <Text style={styles.ctaText}>Walk or Wait?</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC', gap: 12 },
  backButton: { width: 36, height: 36, backgroundColor: '#F7F8F5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  headerSub: { fontSize: 12, color: '#6B7280' },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 50 },
  statusPillText: { fontSize: 12, fontWeight: '700' },
  etaHero: { backgroundColor: '#1C6B2A', margin: 16, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  etaLeft: { gap: 4 },
  etaLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.8 },
  etaValue: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', lineHeight: 42 },
  etaUpdated: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  etaRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  etaStat: { alignItems: 'center', gap: 2 },
  etaStatValue: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  etaStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  etaStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  miniMap: { backgroundColor: '#E8F0E8', marginHorizontal: 16, marginBottom: 16, borderRadius: 14, height: 120, alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' },
  miniMapText: { fontSize: 14, fontWeight: '600', color: '#1C6B2A' },
  livePill: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1C6B2A' },
  liveText: { fontSize: 11, fontWeight: '700', color: '#1C6B2A' },
  section: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 14, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
  stopRow: { flexDirection: 'row', gap: 12, minHeight: 44 },
  stopLeft: { width: 12, alignItems: 'center' },
  stopDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#D0D0CC', marginTop: 4 },
  stopDotActive: { backgroundColor: '#1C6B2A' },
  connector: { width: 1.5, flex: 1, backgroundColor: '#E0E0DC', marginTop: 4 },
  stopContent: { flex: 1, paddingVertical: 4, gap: 2 },
  stopName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  stopNameMuted: { fontWeight: '500', color: '#6B7280' },
  stopType: { fontSize: 11, color: '#9CA3AF' },
  stopEta: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  stopEtaActive: { color: '#1C6B2A', fontWeight: '600' },
  ctaButton: { backgroundColor: '#1C6B2A', borderRadius: 50, paddingVertical: 16, marginHorizontal: 16, marginBottom: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});