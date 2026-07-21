import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function RoutesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Routes</Text>
          <Text style={styles.headerSubtitle}>Select a route to see details</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.routeName}>Route A - KSB</Text>
          <Text style={styles.routeDetails}>5 stops, ~12 min loop</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>✅ Has Space</Text>
          </View>
          <Text style={styles.nextArrival}>Next arrival: 4 min</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.routeName}>Paa Joe Route</Text>
          <Text style={styles.routeDetails}>4 stops, ~10 min loop</Text>
          <View style={[styles.statusBadge, styles.statusFull]}>
            <Text style={styles.statusText}>⚠️ Currently full</Text>
          </View>
          <Text style={styles.nextArrival}>Next arrival: 8 min</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.routeName}>SRC Route</Text>
          <Text style={styles.routeDetails}>6 stops, ~15 min loop</Text>
          <View style={[styles.statusBadge, styles.statusInactive]}>
            <Text style={styles.statusText}>❌ No shuttle active</Text>
          </View>
          <Text style={styles.nextArrival}>Next arrival: N/A</Text>
        </View>

        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationTitle}>🚶 Walk or wait?</Text>
          <Text style={styles.recommendationText}>RECOMMENDATION: Wait</Text>
          <Text style={styles.recommendationDetail}>Shuttle arrives in 4 min</Text>
          <View style={styles.comparison}>
            <Text>🚶 Walk: 8 min (~450m)</Text>
            <Text>⏱️ Wait: 4 min</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  routeDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  statusFull: {
    backgroundColor: '#FFF3E0',
  },
  statusInactive: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
  nextArrival: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 12,
  },
  recommendationBox: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  recommendationDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  comparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});