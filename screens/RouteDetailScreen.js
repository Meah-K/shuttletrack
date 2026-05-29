import React from 'react';
import {
  View, Text, FlatList,
  StyleSheet, SafeAreaView
} from 'react-native';

export default function RouteDetailScreen({ route }) {
  const { route: shuttleRoute } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: shuttleRoute.color }]}>
        <Text style={styles.headerTitle}>{shuttleRoute.name}</Text>
        <Text style={styles.headerSub}>{shuttleRoute.totalStops} stops · {shuttleRoute.loopTimeMinutes} min loop</Text>
      </View>

      <Text style={styles.sectionTitle}>🗺 Stops on this route</Text>

      <FlatList
        data={shuttleRoute.stops}
        keyExtractor={(item) => item.stopId}
        renderItem={({ item, index }) => (
          <View style={styles.stopRow}>
            <View style={styles.stopNumber}>
              <Text style={styles.stopNumberText}>{index + 1}</Text>
            </View>
            <View>
              <Text style={styles.stopName}>{item.name}</Text>
              <Text style={styles.stopCoords}>
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    padding: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  headerSub: { fontSize: 13, color: 'white', marginTop: 4, opacity: 0.9 },
  sectionTitle: {
    fontSize: 16, fontWeight: 'bold',
    padding: 16, color: '#333'
  },
  stopRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', marginHorizontal: 16,
    marginBottom: 8, padding: 14, borderRadius: 10,
    elevation: 1,
  },
  stopNumber: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#1C6B2A', alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  stopNumberText: { color: 'white', fontWeight: 'bold' },
  stopName: { fontSize: 15, fontWeight: '600', color: '#333' },
  stopCoords: { fontSize: 11, color: '#999', marginTop: 2 },
});