import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function RoutesListScreen({ navigation }) {
  // All routes based on your Figma
  const allRoutes = [
    {
      id: '1',
      name: 'Route A - Main Gate',
      stops: 5,
      loopTime: '~12 min',
      status: 'Has Space',
      nextArrival: '4 min',
      color: '#4CAF50',
    },
    {
      id: '2',
      name: 'Paa Joe Route',
      stops: 4,
      loopTime: '~10 min',
      status: 'Currently full',
      nextArrival: '8 min',
      color: '#FF9800',
    },
    {
      id: '3',
      name: 'SRC Route',
      stops: 6,
      loopTime: '~15 min',
      status: 'No shuttle active',
      nextArrival: 'N/A',
      color: '#F44336',
    },
    {
      id: '4',
      name: 'Unity Hall Route',
      stops: 3,
      loopTime: '~8 min',
      status: 'Has Space',
      nextArrival: '2 min',
      color: '#2196F3',
    },
  ];

  const renderRouteCard = ({ item }) => (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={() => navigation.navigate('RouteDetail', { route: item })}
    >
      <View style={[styles.colorBar, { backgroundColor: item.color }]} />
      
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{item.name}</Text>
        <Text style={styles.routeDetails}>
          {item.stops} stops • {item.loopTime} loop
        </Text>
        
        <View style={styles.statusRow}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: item.status === 'Has Space' ? '#4CAF50' : 
                               item.status === 'Currently full' ? '#FF9800' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.arrivalInfo}>
        <Text style={styles.arrivalLabel}>Next</Text>
        <Text style={styles.arrivalTime}>{item.nextArrival}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Routes</Text>
        <Text style={styles.headerSubtitle}>Select a route to see details</Text>
      </View>
      
      <FlatList
        data={allRoutes}
        renderItem={renderRouteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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
  listContent: {
    padding: 16,
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  colorBar: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  arrivalInfo: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  arrivalLabel: {
    fontSize: 10,
    color: '#999',
  },
  arrivalTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});