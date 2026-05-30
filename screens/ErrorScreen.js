// screens/ErrorScreen.js
// S-14 — Error / Offline Screen
// Marvelle | feature/notifications-marvelle
//
// USAGE: Show this screen when isNetworkError is true in mockData.js
// Example (in your navigator or parent screen):
//   import { isNetworkError } from '../mockData';
//   import ErrorScreen from '../screens/ErrorScreen';
//   if (isNetworkError) return <ErrorScreen onRetry={handleRetry} />;

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function ErrorScreen({ onRetry }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F0" />

      <View style={styles.inner}>
        {/* Illustration placeholder */}
        <View style={styles.illustration}>
          <Text style={styles.illustrationIcon}>📡</Text>
        </View>

        <Text style={styles.title}>You're offline</Text>
        <Text style={styles.message}>
          We couldn't load shuttle data. Please check your internet connection and try again.
        </Text>

        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F0',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  illustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  illustrationIcon: {
    fontSize: 44,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  retryBtn: {
    backgroundColor: '#1C6B2A',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
