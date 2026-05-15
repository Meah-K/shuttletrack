// screens/NotificationDetailScreen.js
// S-11 — Notification Detail Screen
// Marvelle | feature/notifications-marvelle

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

// Badge color based on notification type
const TYPE_STYLES = {
  DELAY: { bg: '#FEE2E2', text: '#DC2626', label: 'Delay Alert' },
  STATUS: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Status Update' },
  GENERAL: { bg: '#F3F4F6', text: '#6B7280', label: 'General Info' },
};

export default function NotificationDetailScreen({ route, navigation }) {
  const { notification } = route.params;

  // Mark as read in local state when screen opens
  const [notif, setNotif] = useState(notification);

  useEffect(() => {
    if (!notif.isRead) {
      setNotif(prev => ({ ...prev, isRead: true }));
    }
  }, []);

  const typeStyle = TYPE_STYLES[notif.type] || TYPE_STYLES.GENERAL;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F0" />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Alert detail</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Type badge */}
        <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
          <View style={[styles.badgeDot, { backgroundColor: typeStyle.text }]} />
          <Text style={[styles.badgeText, { color: typeStyle.text }]}>{typeStyle.label}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{notif.title}</Text>

        {/* Timestamp */}
        <Text style={styles.timeAgo}>{notif.timeAgo}</Text>

        {/* Full message */}
        <Text style={styles.message}>{notif.message}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  backArrow: {
    fontSize: 18,
    color: '#111',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    lineHeight: 34,
    marginBottom: 8,
  },
  timeAgo: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  message: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 28,
  },
});
