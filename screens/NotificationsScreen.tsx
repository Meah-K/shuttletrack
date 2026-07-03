import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notifications as initialNotifications } from '../mockData';
import type { AppNotification } from '../mockData';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Notifications: undefined;
  NotificationDetail: { notification: AppNotification };
};

type NotificationsNavigationProp = StackNavigationProp<RootStackParamList, 'Notifications'>;

interface NotificationsScreenProps {
  navigation: NotificationsNavigationProp;
}

export default function NotificationsScreen({ navigation }: NotificationsScreenProps): React.JSX.Element {
  const sorted = [...initialNotifications].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  const [notifs, setNotifs] = useState<AppNotification[]>(sorted);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNotifs([...sorted]);
      setRefreshing(false);
    }, 1000);
  }, []);

  function markAllRead(): void {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  }

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('NotificationDetail', { notification: item })}
      activeOpacity={0.7}
    >
      <View style={[styles.dot, item.isRead ? styles.dotRead : styles.dotUnread]} />
      <View style={styles.cardContent}>
        <Text style={[styles.title, item.isRead && styles.titleRead]}>{item.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Alerts</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadCount}>{unreadCount} unread</Text>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
          <Ionicons name="checkmark-done" size={16} color="#1C6B2A" />
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
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={40} color="#D0D0CC" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC' },
  heading: { fontSize: 26, fontWeight: '700', color: '#1A1A1A' },
  unreadCount: { fontSize: 13, color: '#1C6B2A', fontWeight: '600', marginTop: 2 },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllRead: { fontSize: 14, color: '#1C6B2A', fontWeight: '500' },
  list: { padding: 16 },
  card: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: '#E0E0DC', marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, marginRight: 12, flexShrink: 0 },
  dotUnread: { backgroundColor: '#1C6B2A' },
  dotRead: { backgroundColor: '#D1D5DB' },
  cardContent: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  titleRead: { color: '#6B7280', fontWeight: '500' },
  message: { fontSize: 13, color: '#6B7280', lineHeight: 20, marginBottom: 8 },
  timeAgo: { fontSize: 11, color: '#9CA3AF' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#6B7280' },
});