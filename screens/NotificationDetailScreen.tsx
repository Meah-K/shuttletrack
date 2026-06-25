import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { AppNotification, NotificationType } from '../mockData';

type RootStackParamList = {
  NotificationDetail: { notification: AppNotification };
};

type NotificationDetailNavigationProp = StackNavigationProp<RootStackParamList, 'NotificationDetail'>;
type NotificationDetailRouteProp = RouteProp<RootStackParamList, 'NotificationDetail'>;

interface NotificationDetailScreenProps {
  navigation: NotificationDetailNavigationProp;
  route: NotificationDetailRouteProp;
}

interface TypeStyle {
  bg: string;
  text: string;
  label: string;
}

const TYPE_STYLES: Record<NotificationType, TypeStyle> = {
  DELAY: { bg: '#FEE2E2', text: '#DC2626', label: 'Delay Alert' },
  STATUS: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Status Update' },
  GENERAL: { bg: '#F3F4F6', text: '#6B7280', label: 'General Info' },
};

export default function NotificationDetailScreen({ route, navigation }: NotificationDetailScreenProps): React.JSX.Element {
  const { notification } = route.params;
  const [notif, setNotif] = useState<AppNotification>(notification);

  useEffect(() => {
    if (!notif.isRead) {
      setNotif(prev => ({ ...prev, isRead: true }));
    }
  }, []);

  const typeStyle = TYPE_STYLES[notif.type] ?? TYPE_STYLES.GENERAL;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.heading}>Alert detail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
          <View style={[styles.badgeDot, { backgroundColor: typeStyle.text }]} />
          <Text style={[styles.badgeText, { color: typeStyle.text }]}>{typeStyle.label}</Text>
        </View>

        <Text style={styles.title}>{notif.title}</Text>
        <Text style={styles.timeAgo}>{notif.timeAgo}</Text>
        <Text style={styles.message}>{notif.message}</Text>

        {notif.affectedRouteName && (
          <View style={styles.routeTag}>
            <Ionicons name="bus-outline" size={14} color="#1C6B2A" />
            <Text style={styles.routeTagText}>{notif.affectedRouteName}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC' },
  backBtn: { width: 36, height: 36, backgroundColor: '#F7F8F5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  content: { padding: 24 },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginBottom: 20, gap: 8 },
  badgeDot: { width: 10, height: 10, borderRadius: 5 },
  badgeText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', lineHeight: 34, marginBottom: 8 },
  timeAgo: { fontSize: 14, color: '#9CA3AF', marginBottom: 20 },
  message: { fontSize: 17, color: '#374151', lineHeight: 28, marginBottom: 20 },
  routeTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EAF5EC', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start' },
  routeTagText: { fontSize: 13, fontWeight: '600', color: '#1C6B2A' },
});