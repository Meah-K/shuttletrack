import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function DriverErrorScreen({ navigation }) {

  function handleRetry() {
    navigation.replace('DriverStatus');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>

        {/* Icon */}
        <View style={styles.iconBox}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        <Text style={styles.title}>GPS unavailable</Text>

        <Text style={styles.message}>
          Your location is not being shared. Students cannot see your shuttle on the map.
        </Text>

        {/* Warning banner */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠ Status updates paused</Text>
        </View>

        {/* Retry button */}
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Retry connection</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Check location permissions in your phone settings</Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconBox: {
    width: 100,
    height: 100,
    backgroundColor: '#FFF0F0',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  warningBanner: {
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E63946',
  },
  retryButton: {
    backgroundColor: '#1C6B2A',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 12,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});