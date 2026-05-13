import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 
export default function DriverErrorScreen({ navigation }) {
 
  const handleRetry = () => {
    // In the real app, this would re-check the internet and GPS.
    // For now, just navigate back to the Driver Status screen.
    navigation.replace('DriverStatus');
  };
 
  return (
    <View style={styles.container}>
 
      {/* Warning icon */}
      <Text style={styles.icon}>⚠️</Text>
 
      <Text style={styles.title}>Connection Lost</Text>
 
      <Text style={styles.message}>
        Your GPS signal or internet connection is unavailable.{''}
        ShuttleTrack cannot update your location right now.{''}
        Please check your connection and tap Retry.
      </Text>
 
      <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
 
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C0392B',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#5D6D7E',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  retryBtn: {
    backgroundColor: '#C0392B',
    paddingVertical: 16,
    paddingHorizontal: 52,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});