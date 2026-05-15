// components/EmptyShuttleState.js
// S-13 — No Shuttle / Empty State Component
// Marvelle | feature/notifications-marvelle
//
// USAGE: Import and show this component when isNoShuttlesActive is true
// Example:
//   import EmptyShuttleState from '../components/EmptyShuttleState';
//   import { isNoShuttlesActive } from '../mockData';
//   {isNoShuttlesActive && <EmptyShuttleState onRefresh={handleRefresh} />}

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function EmptyShuttleState({ onRefresh }) {
  return (
    <View style={styles.container}>
      {/* Illustration placeholder */}
      <View style={styles.illustration}>
        <Text style={styles.illustrationIcon}>🚌</Text>
      </View>

      <Text style={styles.title}>No active shuttles</Text>
      <Text style={styles.message}>
        There are no shuttles currently running on any route. Check back shortly.
      </Text>

      <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} activeOpacity={0.8}>
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    backgroundColor: '#F2F2F0',
  },
  illustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  illustrationIcon: {
    fontSize: 44,
  },
  title: {
    fontSize: 20,
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
  refreshBtn: {
    backgroundColor: '#1C6B2A',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
