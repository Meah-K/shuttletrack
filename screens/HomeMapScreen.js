import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { shuttles } from '../mockData';

export default function HomeMapScreen({ navigation }) {
  const [shuttleData, setShuttleData] = useState(shuttles);

  useEffect(() => {
    const interval = setInterval(() => {
      setShuttleData([...shuttles]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function getStatusLabel(status) {
    if (status === 'HAS_SPACE') return 'Has space';
    if (status === 'FULL') return 'Full';
    return 'Inactive';
  }

  function getBadgeStyle(status) {
    if (status === 'HAS_SPACE') return styles.badgeGreen;
    if (status === 'FULL') return styles.badgeRed;
    return styles.badgeGrey;
  }

  function getBadgeTextStyle(status) {
    if (status === 'HAS_SPACE') return styles.badgeTextGreen;
    if (status === 'FULL') return styles.badgeTextRed;
    return styles.badgeTextGrey;
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapText}>Live Campus Map</Text>
        <Text style={styles.mapSub}>Map renders on mobile device</Text>

        {/* Shuttle markers simulation */}
        <View style={styles.markersRow}>
          {shuttleData.map((shuttle) => (
            <View
              key={shuttle.shuttleId}
              style={[
                styles.marker,
                { backgroundColor: shuttle.status === 'HAS_SPACE' ? '#1C6B2A' : shuttle.status === 'FULL' ? '#E63946' : '#6B7280' }
              ]}
            >
              <Text style={styles.markerText}>🚌</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search stops or routes...</Text>
      </View>

      {/* Bottom sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Active shuttles</Text>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

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
                <Text style={getBadgeTextStyle(shuttle.status)}>
                  {getStatusLabel(shuttle.status)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F0E8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapEmoji: {
    fontSize: 48,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C6B2A',
  },
  mapSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  markersRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerText: {
    fontSize: 20,
  },
  searchBar: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D0D0CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1C6B2A',
  },
  liveText: {
    fontSize: 12,
    color: '#6B7280',
  },
  shuttleCard: {
    backgroundColor: '#F7F8F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  badgeGreen: { backgroundColor: '#EAF5EC' },
  badgeRed: { backgroundColor: '#FFF0F0' },
  badgeGrey: { backgroundColor: '#F3F4F6' },
  badgeTextGreen: { fontSize: 11, fontWeight: '700', color: '#1C6B2A' },
  badgeTextRed: { fontSize: 11, fontWeight: '700', color: '#E63946' },
  badgeTextGrey: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
});