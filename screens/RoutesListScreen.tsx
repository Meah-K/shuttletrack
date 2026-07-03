import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { routes, shuttles } from '../mockData';
import type { Route, Shuttle, ShuttleStatus } from '../mockData';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  RoutesList: undefined;
  RouteDetail: { route: Route; shuttle: Shuttle | undefined };
};

type RoutesListNavigationProp = StackNavigationProp<RootStackParamList, 'RoutesList'>;

interface RoutesListScreenProps {
  navigation: RoutesListNavigationProp;
}

function getShuttleForRoute(routeId: string): Shuttle | undefined {
  return shuttles.find(s => s.routeId === routeId);
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

export default function RoutesListScreen({ navigation }: RoutesListScreenProps): React.JSX.Element {

  const renderRouteCard = ({ item }: { item: Route }) => {
    const shuttle = getShuttleForRoute(item.routeId);
    const status: ShuttleStatus = shuttle ? shuttle.status : 'INACTIVE';

    return (
      <TouchableOpacity
        style={styles.routeCard}
        onPress={() => navigation.navigate('RouteDetail', { route: item, shuttle })}
      >
        <View style={[styles.colorBar, { backgroundColor: item.color }]} />
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{item.name}</Text>
          <Text style={styles.routeDetails}>
            {item.totalStops} stops · ~{item.loopTimeMinutes} min loop
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
            <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
          </View>
        </View>
        <View style={styles.arrivalInfo}>
          <Text style={styles.arrivalLabel}>Next</Text>
          <Text style={styles.arrivalTime}>
            {shuttle?.etaMinutes ? `${shuttle.etaMinutes} min` : 'N/A'}
          </Text>
        </View>
        <View style={[styles.badge, getBadgeStyle(status)]}>
          <Text style={getBadgeTextStyle(status)}>{getStatusLabel(status)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Routes</Text>
        <Text style={styles.headerSubtitle}>{routes.length} active routes on campus</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={14} color="#6B7280" />
        <Text style={styles.searchPlaceholder}>Search routes...</Text>
      </View>

      <FlatList
        data={routes}
        renderItem={renderRouteCard}
        keyExtractor={(item) => item.routeId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC' },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  searchBar: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0DC', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, marginBottom: 4 },
  searchPlaceholder: { fontSize: 14, color: '#6B7280' },
  listContent: { padding: 16 },
  routeCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, marginBottom: 12, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: '#E0E0DC', gap: 12 },
  colorBar: { width: 4, height: 56, borderRadius: 2 },
  routeInfo: { flex: 1, gap: 4 },
  routeName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  routeDetails: { fontSize: 12, color: '#6B7280' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, color: '#6B7280' },
  arrivalInfo: { alignItems: 'center', backgroundColor: '#F7F8F5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  arrivalLabel: { fontSize: 10, color: '#6B7280' },
  arrivalTime: { fontSize: 13, fontWeight: '700', color: '#1C6B2A' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 },
  badgeGreen: { backgroundColor: '#EAF5EC' },
  badgeRed: { backgroundColor: '#FFF0F0' },
  badgeGrey: { backgroundColor: '#F3F4F6' },
  badgeTextGreen: { fontSize: 10, fontWeight: '700', color: '#1C6B2A' },
  badgeTextRed: { fontSize: 10, fontWeight: '700', color: '#E63946' },
  badgeTextGrey: { fontSize: 10, fontWeight: '700', color: '#6B7280' },
});