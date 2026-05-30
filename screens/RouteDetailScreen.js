import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function RouteDetailScreen({ navigation, route }) {
  const [selectedDestination, setSelectedDestination] = useState('Main Gate');
  
  // Route data matching your Figma
  const routeData = {
    name: 'Route A - Main Gate',
    stops: 5,
    loopTime: '12 min',
    status: 'Has Space',
    nextArrival: '4 min',
    walkingTime: '8 min',
    walkingDistance: '~450m straight line',
    stopsList: [
      { name: 'Main Gate', type: 'Starting point', time: '4 min' },
      { name: 'Unity Hall', type: 'Stop 2', time: '9 min' },
      { name: 'SRC Bus Stop', type: 'Stop 3', time: '14 min' },
      { name: 'Paa Joe', type: 'Stop 4', time: '18 min' },
    ]
  };

  const otherRoutes = [
    { name: 'Paa Joe Route', stops: 4, loopTime: '~10 min loop', status: 'Currently full' },
    { name: 'SRC Route', stops: 6, loopTime: '~15 min loop', status: 'No shuttle active' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Main Route Card */}
        <View style={styles.mainRouteCard}>
          <Text style={styles.routeTitle}>{routeData.name}</Text>
          <Text style={styles.routeSubtitle}>{routeData.stops} stops, ~ {routeData.loopTime} loop</Text>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>✅ {routeData.status}</Text>
            </View>
            <View style={styles.arrivalContainer}>
              <Text style={styles.arrivalLabel}>Next arrival</Text>
              <Text style={styles.arrivalTime}>{routeData.nextArrival}</Text>
            </View>
            <View style={styles.loopContainer}>
              <Text style={styles.loopLabel}>Loop time</Text>
              <Text style={styles.loopTime}>{routeData.loopTime}</Text>
            </View>
          </View>
        </View>

        {/* All Stops Section */}
        <View style={styles.stopsSection}>
          <Text style={styles.sectionTitle}>All stops</Text>
          {routeData.stopsList.map((stop, index) => (
            <View key={index} style={styles.stopItem}>
              <View style={styles.stopDotContainer}>
                <View style={styles.stopDot} />
                {index < routeData.stopsList.length - 1 && <View style={styles.stopLine} />}
              </View>
              <View style={styles.stopContent}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopType}>{stop.type}</Text>
              </View>
              <Text style={styles.stopTime}>{stop.time}</Text>
            </View>
          ))}
        </View>

        {/* Other Routes Section */}
        <View style={styles.otherRoutesSection}>
          <Text style={styles.sectionTitle}>Other Routes</Text>
          {otherRoutes.map((route, index) => (
            <TouchableOpacity key={index} style={styles.otherRouteCard}>
              <View>
                <Text style={styles.otherRouteName}>{route.name}</Text>
                <Text style={styles.otherRouteInfo}>{route.stops} stops, {route.loopTime}</Text>
              </View>
              <Text style={[
                styles.otherRouteStatus,
                route.status === 'Currently full' && styles.statusFull,
                route.status === 'No shuttle active' && styles.statusInactive
              ]}>
                {route.status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Walk or Wait Section - RECOMMENDATION */}
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationTitle}>🚶 Walk or wait?</Text>
          
          {/* Destination Selector */}
          <View style={styles.destinationSelector}>
            <Text style={styles.destinationLabel}>Where are you going?</Text>
            <View style={styles.destinationButtons}>
              <TouchableOpacity 
                style={[styles.destButton, selectedDestination === 'Main Gate' && styles.activeDestButton]}
                onPress={() => setSelectedDestination('Main Gate')}>
                <Text style={[styles.destButtonText, selectedDestination === 'Main Gate' && styles.activeDestText]}>Main Gate</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.destButton, selectedDestination === 'Paa Joe' && styles.activeDestButton]}
                onPress={() => setSelectedDestination('Paa Joe')}>
                <Text style={[styles.destButtonText, selectedDestination === 'Paa Joe' && styles.activeDestText]}>Paa Joe</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.destButton, selectedDestination === 'SRC' && styles.activeDestButton]}
                onPress={() => setSelectedDestination('SRC')}>
                <Text style={[styles.destButtonText, selectedDestination === 'SRC' && styles.activeDestText]}>SRC</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recommendation Card */}
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationLabel}>RECOMMENDATION</Text>
            <Text style={styles.recommendationValue}>🚌 Wait</Text>
            <Text style={styles.recommendationDetail}>Shuttle arrives in {routeData.nextArrival}</Text>
            
            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Walking time</Text>
                <Text style={styles.comparisonValue}>🚶 {routeData.walkingTime}</Text>
                <Text style={styles.comparisonDistance}>{routeData.walkingDistance}</Text>
              </View>
              <View style={styles.comparisonDivider} />
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Wait time</Text>
                <Text style={styles.comparisonValue}>⏱️ {routeData.nextArrival}</Text>
                <Text style={styles.comparisonDistance}>Shuttle arrives soon</Text>
              </View>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backArrow: {
    fontSize: 28,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  mainRouteCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  routeSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: '500',
    fontSize: 12,
  },
  arrivalContainer: {
    alignItems: 'center',
  },
  arrivalLabel: {
    fontSize: 10,
    color: '#999',
  },
  arrivalTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loopContainer: {
    alignItems: 'center',
  },
  loopLabel: {
    fontSize: 10,
    color: '#999',
  },
  loopTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  stopsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  stopItem: {
    flexDirection: 'row',
    marginBottom: 12,
    position: 'relative',
  },
  stopDotContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginTop: 6,
  },
  stopLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: 16,
    bottom: -16,
    width: 2,
  },
  stopContent: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  stopType: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  stopTime: {
    fontSize: 14,
    color: '#666',
  },
  otherRoutesSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  otherRouteCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otherRouteName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  otherRouteInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  otherRouteStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
  statusFull: {
    color: '#FF9800',
  },
  statusInactive: {
    color: '#F44336',
  },
  recommendationSection: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  destinationSelector: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  destinationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  destinationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  destButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  activeDestButton: {
    backgroundColor: '#007AFF',
  },
  destButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeDestText: {
    color: '#fff',
  },
  recommendationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  recommendationLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    letterSpacing: 1,
  },
  recommendationValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
  recommendationDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  comparisonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  comparisonDistance: {
    fontSize: 11,
    color: '#999',
  },
});