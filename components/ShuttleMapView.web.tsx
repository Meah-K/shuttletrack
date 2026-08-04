import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Shuttle, ShuttleStatus } from '../mockData';

interface CampusCenter {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Props {
  shuttleData: Shuttle[];
  campusCenter: CampusCenter;
  getMarkerColor: (status: ShuttleStatus) => string;
  getStatusLabel: (status: ShuttleStatus) => string;
  onMarkerPress: (shuttle: Shuttle) => void;
}

export default function ShuttleMapView({
  shuttleData,
  getMarkerColor,
}: Props): React.JSX.Element {
  return (
    <View style={styles.mapPlaceholder}>
      <Text style={styles.mapEmoji}>🗺️</Text>
      <Text style={styles.mapText}>Live Campus Map</Text>
      <Text style={styles.mapSub}>Map renders on mobile device</Text>
      <View style={styles.markersRow}>
        {shuttleData.map((shuttle) => (
          <View
            key={shuttle.shuttleId}
            style={[styles.marker, { backgroundColor: getMarkerColor(shuttle.status) }]}
          >
            <Ionicons name="bus" size={16} color="white" />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: { flex: 1, backgroundColor: '#E8F0E8', alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapEmoji: { fontSize: 48 },
  mapText: { fontSize: 18, fontWeight: '700', color: '#1C6B2A' },
  mapSub: { fontSize: 13, color: '#6B7280' },
  markersRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  marker: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'white' },
});