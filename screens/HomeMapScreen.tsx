import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shuttles as mockShuttles } from '../mockData';
import type { Shuttle, ShuttleStatus } from '../mockData';
import type { StackNavigationProp } from '@react-navigation/stack';
import { moveShuttles } from '../utils/shuttleSimulator';
import { getShuttlesWithEta } from '../utils/api';
import ShuttleMapView from '../components/ShuttleMapView';


type RootStackParamList = {
  HomeMap: undefined;
  ShuttleDetail: { shuttle: Shuttle };
};

type HomeMapNavigationProp = StackNavigationProp<RootStackParamList, 'HomeMap'>;

interface HomeMapScreenProps {
  navigation: HomeMapNavigationProp;
}

interface Ad {
  id: number;
  title: string;
  subtitle: string;
  color: string;
}


const ADS: Ad[] = [
  { id: 1, title: 'Chicken Republic — Paa Joe', subtitle: '10% off with code SHUTTLE10 🍗', color: '#E63946' },
  { id: 2, title: 'Papaye Restaurant — Main Gate', subtitle: 'Free drink with any meal today 🥤', color: '#1C6B2A' },
  { id: 3, title: 'KNUST Print Shop — SRC', subtitle: 'Print 50 pages for GHS 5 only 🖨️', color: '#2E5F8A' },
];

const CAMPUS_CENTER = {
  latitude: 6.6736,
  longitude: -1.5727,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

function getMarkerColor(status: ShuttleStatus): string {
  if (status === 'HAS_SPACE') return '#1C6B2A';
  if (status === 'FULL') return '#E63946';
  return '#6B7280';
}

function getStatusLabel(status: ShuttleStatus): string {
  if (status === 'HAS_SPACE') return 'Has space';
  if (status === 'FULL') return 'Full';
  return 'Inactive';
}

interface MemoizedMapProps {
  shuttleData: Shuttle[];
  onMarkerPress: (shuttle: Shuttle) => void;
}

const MemoizedMap = React.memo(function MemoizedMap({ shuttleData, onMarkerPress }: MemoizedMapProps) {
  return (
    <ShuttleMapView
      shuttleData={shuttleData}
      campusCenter={CAMPUS_CENTER}
      getMarkerColor={getMarkerColor}
      getStatusLabel={getStatusLabel}
      onMarkerPress={onMarkerPress}
    />
  );
});

export default function HomeMapScreen({ navigation }: HomeMapScreenProps): React.JSX.Element {
  // Real data (fetched from backend) and mock data (demo filler) are kept separate.
  const [realShuttleData, setRealShuttleData] = useState<Shuttle[]>([]);
  const [mockShuttleData, setMockShuttleData] = useState<Shuttle[]>(mockShuttles);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [currentAd, setCurrentAd] = useState<number>(0);
  const sheetHeight = useRef(new Animated.Value(1)).current;

  // Merged list used for rendering — real shuttle(s) first, then mock filler.
const shuttleData = [...realShuttleData].sort((a, b) =>
  a.routeId.localeCompare(b.routeId)
);
  // Fetch the real shuttle(s) on mount, then poll periodically to keep ETA/status fresh.
  React.useEffect(() => {
    let isMounted = true;
async function loadRealShuttles() {
  try {
    const real = await getShuttlesWithEta();

    const cleaned = real.map(shuttle => ({
      ...shuttle,
      routeName: shuttle.routeName ?? shuttle.routeId,
    }));

    setRealShuttleData(cleaned);

  } catch (err) {
    console.log(err);
  }
}

    loadRealShuttles();
    const pollInterval = setInterval(loadRealShuttles, 10000); // refresh every 10s

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Rotate ads every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd(prev => (prev + 1) % ADS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Move ONLY the mock shuttles every 8 seconds — real shuttle position comes from the backend poll above.
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMockShuttleData(prev => moveShuttles(prev));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  function toggleSheet(): void {
    Animated.spring(sheetHeight, {
      toValue: isExpanded ? 0 : 1,
      useNativeDriver: false,
      tension: 100,
      friction: 12,
    }).start();
    setIsExpanded(!isExpanded);
  }

  const sheetHeightInterpolated = sheetHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 290],
  });

  function getBadgeStyle(status: ShuttleStatus) {
    if (status === 'HAS_SPACE') return styles.badgeGreen;
    if (status === 'FULL') return styles.badgeRed;
    return styles.badgeGrey;
  }

  function getBadgeTextStyle(status: ShuttleStatus) {
    if (status === 'HAS_SPACE') return styles.badgeTextGreen;
    if (status === 'FULL') return styles.badgeTextRed;
    return styles.badgeTextGrey;
  }

  const ad = ADS[currentAd];

  return (
    <SafeAreaView style={styles.container}>
      <MemoizedMap
        shuttleData={shuttleData}
        onMarkerPress={(shuttle) => navigation.navigate('ShuttleDetail', { shuttle })}
      />

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color="#6B7280" />
        <Text style={styles.searchPlaceholder}>Search stops or routes...</Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#1C6B2A' }]} />
          <Text style={styles.legendText}>Has space</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#E63946' }]} />
          <Text style={styles.legendText}>Full</Text>
        </View>
      </View>

      <View style={styles.adBanner}>
        <View style={styles.adLeft}>
          <Text style={styles.adTag}>AD</Text>
          <View style={styles.adContent}>
            <Text style={styles.adTitle}>{ad.title}</Text>
            <Text style={styles.adSub}>{ad.subtitle}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.adButton, { backgroundColor: ad.color }]}>
          <Text style={styles.adButtonText}>View</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.bottomSheet, { height: sheetHeightInterpolated }]}>
        <TouchableOpacity onPress={toggleSheet} style={styles.sheetTopRow} activeOpacity={0.8}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Active shuttles</Text>
            <View style={styles.sheetRight}>
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
              <Ionicons name={isExpanded ? 'chevron-down' : 'chevron-up'} size={18} color="#6B7280" />
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {shuttleData.map((shuttle) => (
              <TouchableOpacity
                key={shuttle.shuttleId}
                style={styles.shuttleCard}
                onPress={() => navigation.navigate('ShuttleDetail', { shuttle })}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.cardName}>{shuttle.routeName}</Text>
                  <Text style={styles.cardSub}>
                    {shuttle.etaMinutes ? `ETA ${shuttle.etaMinutes} min` : 'No ETA available'}
                  </Text>
                </View>
                <View style={[styles.badge, getBadgeStyle(shuttle.status)]}>
                  <Text style={getBadgeTextStyle(shuttle.status)}>{getStatusLabel(shuttle.status)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D0D0CC" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  map: { flex: 1 },
  mapPlaceholder: { flex: 1, backgroundColor: '#E8F0E8', alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapEmoji: { fontSize: 48 },
  mapText: { fontSize: 18, fontWeight: '700', color: '#1C6B2A' },
  mapSub: { fontSize: 13, color: '#6B7280' },
  markersRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  marker: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'white' },
  searchBar: { position: 'absolute', top: 56, left: 16, right: 16, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  searchPlaceholder: { fontSize: 14, color: '#6B7280' },
  legend: { position: 'absolute', top: 110, right: 16, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#1A1A1A', fontWeight: '600' },
  adBanner: { position: 'absolute', top: 110, left: 16, right: 120, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, borderLeftWidth: 3, borderLeftColor: '#1C6B2A' },
  adLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  adTag: { fontSize: 9, fontWeight: '700', color: '#FFFFFF', backgroundColor: '#6B7280', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  adContent: { flex: 1, gap: 2 },
  adTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  adSub: { fontSize: 11, color: '#6B7280' },
  adButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50 },
  adButtonText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 10, overflow: 'hidden' },
  sheetTopRow: { paddingTop: 10, paddingBottom: 8 },
  handle: { width: 40, height: 4, backgroundColor: '#D0D0CC', borderRadius: 2, alignSelf: 'center', marginBottom: 10 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1C6B2A' },
  liveText: { fontSize: 12, color: '#6B7280' },
shuttleCard: {
  backgroundColor: '#F7F8F5',
  borderRadius: 10,
  paddingVertical: 18,        
  paddingHorizontal: 16,      // was implicit 12
  marginBottom: 10,           // was 8
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
},  cardLeft: { flex: 1, gap: 3 },
  cardName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  cardSub: { fontSize: 12, color: '#6B7280' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  badgeGreen: { backgroundColor: '#EAF5EC' },
  badgeRed: { backgroundColor: '#FFF0F0' },
  badgeGrey: { backgroundColor: '#F3F4F6' },
  badgeTextGreen: { fontSize: 11, fontWeight: '700', color: '#1C6B2A' },
  badgeTextRed: { fontSize: 11, fontWeight: '700', color: '#E63946' },
  badgeTextGrey: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
});