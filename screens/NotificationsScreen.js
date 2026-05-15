// screens/NotificationsScreen.js
// S-10 — Notifications List Screen
// Marvelle | feature/notifications-marvelle

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { notifications as initialNotifications } from '../mockData';

export default function NotificationsScreen({ navigation }) {
  // Sort by most recent (sentAt descending)
  const sorted = [...initialNotifications].sort(
    (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
  );

  const [notifs, setNotifs] = useState(sorted);
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh — resets to original sorted data
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNotifs([...sorted]);
      setRefreshing(false);
    }, 1000);
  }, []);

  // Mark all as read
  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('NotificationDetail', { notification: item })}
      activeOpacity={0.7}
    >
      {/* Green dot (unread) or grey dot (read) */}
      <View style={[styles.dot, item.isRead ? styles.dotRead : styles.dotUnread]} />

      <View style={styles.cardContent}>
        <Text style={[styles.title, item.isRead && styles.titleRead]}>{item.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F0" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Alerts</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAllRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifs}
        keyExtractor={item => item.notificationId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1C6B2A" />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet.</Text>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },
  markAllRead: {
    fontSize: 14,
    color: '#1C6B2A',
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  dotUnread: {
    backgroundColor: '#1C6B2A',
  },
  dotRead: {
    backgroundColor: '#D1D5DB',
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  titleRead: {
    color: '#6B7280',
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  timeAgo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    color: '#9CA3AF',
    fontSize: 15,
  },
});
