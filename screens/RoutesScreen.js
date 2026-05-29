import React from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, StyleSheet, SafeAreaView
} from 'react-native';
import { routes } from '../mockData';

export default function RoutesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🚌 Shuttle Routes</Text>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.routeId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate('RouteDetail', { route: item })}
          >
            <Text style={styles.routeName}>{item.name}</Text>
            <Text style={styles.stopCount}>{item.totalStops} stops</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 22, fontWeight: 'bold',
    padding: 20, backgroundColor: '#1C6B2A', color: 'white'
  },
  card: {
    backgroundColor: 'white', padding: 18,
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 10, borderLeftWidth: 6,
    elevation: 2,
  },
  routeName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  stopCount: { fontSize: 13, color: '#888', marginTop: 4 },
});