import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  SafeAreaView, TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { routes } from '../mockData';

const STUDENT_LOCATION = { latitude: 6.6741, longitude: -1.5720 };
const WALKING_SPEED_KMH = 5;

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function WalkOrWaitScreen() {
  const allStops = routes.flatMap((r) => r.stops);
  const [selectedStop, setSelectedStop] = useState(allStops[0].stopId);

  const stop = allStops.find((s) => s.stopId === selectedStop);
  const distanceKm = getDistanceKm(
    STUDENT_LOCATION.latitude, STUDENT_LOCATION.longitude,
    stop.latitude, stop.longitude
  );
  const walkMinutes = Math.round((distanceKm / WALKING_SPEED_KMH) * 60);
  const shuttleEta = 4;
  const shouldWalk = walkMinutes <= shuttleEta;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🚶 Walk or Wait?</Text>

      <Text style={styles.label}>Select your destination:</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedStop}
          onValueChange={(val) => setSelectedStop(val)}
        >
          {allStops.map((s) => (
            <Picker.Item key={s.stopId} label={s.name} value={s.stopId} />
          ))}
        </Picker>
      </View>

      <View style={[styles.resultBox, { backgroundColor: shouldWalk ? '#E8F5E9' : '#E3F2FD' }]}>
        <Text style={[styles.resultText, { color: shouldWalk ? '#1C6B2A' : '#1565C0' }]}>
          {shouldWalk ? '🚶 WALK' : '⏳ WAIT'}
        </Text>
        <Text style={styles.timeText}>
          {shouldWalk
            ? `Walking time: ${walkMinutes} min`
            : `Shuttle arrives in: ${shuttleEta} min`}
        </Text>
        <Text style={styles.distanceText}>
          Distance: {(distanceKm * 1000).toFixed(0)} m
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 22, fontWeight: 'bold',
    padding: 20, backgroundColor: '#1C6B2A', color: 'white'
  },
  label: { fontSize: 15, margin: 16, color: '#333', fontWeight: '600' },
  pickerBox: {
    marginHorizontal: 16, backgroundColor: 'white',
    borderRadius: 10, elevation: 2,
  },
  resultBox: {
    margin: 16, padding: 30, borderRadius: 16,
    alignItems: 'center', elevation: 2,
  },
  resultText: { fontSize: 48, fontWeight: 'bold' },
  timeText: { fontSize: 16, marginTop: 10, color: '#333' },
  distanceText: { fontSize: 13, marginTop: 6, color: '#777' },
});