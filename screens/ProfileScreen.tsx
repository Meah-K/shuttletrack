import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser, logout, type StoredUser } from '../utils/api';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ProfileMain: undefined;
  Login: undefined;
  About: undefined;
  Terms: undefined;
};

type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileMain'>;

interface ProfileScreenProps {
  navigation: ProfileNavigationProp;
}

interface MenuItem {
  icon: string;
  title: string;
  subtitle: string;
  hasSwitch?: boolean;
  value?: boolean;
  setValue?: (val: boolean) => void;
  onPress?: () => void;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps): React.JSX.Element {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await getUser();
      setUser(storedUser);
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleLogout(): Promise<void> {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const menuItems: MenuItem[] = [
    {
      icon: 'notifications-outline',
      title: 'Push notifications',
      subtitle: 'Manage alerts',
      hasSwitch: true,
      value: notificationsEnabled,
      setValue: setNotificationsEnabled,
    },
    {
      icon: 'information-circle-outline',
      title: 'About ShuttleTrack',
      subtitle: 'Version 1.0.0',
      onPress: () => navigation.navigate('About'),
    },
    {
      icon: 'document-text-outline',
      title: 'Terms & Privacy',
      subtitle: 'Legal information',
      onPress: () => navigation.navigate('Terms'),
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#1C6B2A" size="large" />
      </SafeAreaView>
    );
  }

  const displayName = user?.name ?? 'Unknown';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.titleRow}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0)}
            </Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.role}>{user?.role === 'DRIVER' ? 'Driver' : 'Student'}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full name</Text>
            <Text style={styles.infoValue}>{displayName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{user?.userId ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                disabled={!item.onPress}
                activeOpacity={item.onPress ? 0.6 : 1}
              >
                <View style={styles.menuIconBox}>
                  <Ionicons name={item.icon as any} size={20} color="#1C6B2A" />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                {item.hasSwitch && item.setValue ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.setValue}
                    trackColor={{ false: '#D0D0CC', true: '#1C6B2A' }}
                    thumbColor="#FFFFFF"
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#D0D0CC" />
                )}
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  centered: { alignItems: 'center', justifyContent: 'center' },
  titleRow: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1A1A' },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EAF5EC', borderWidth: 2, borderColor: '#1C6B2A', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#1C6B2A' },
  name: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  role: { fontSize: 14, color: '#6B7280' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 0.5, borderColor: '#E0E0DC', marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' },
  infoRow: { padding: 14, gap: 3 },
  infoLabel: { fontSize: 11, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  divider: { height: 0.5, backgroundColor: '#F0F0EC', marginLeft: 14 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F7F8F5', alignItems: 'center', justifyContent: 'center' },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  menuSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  logoutButton: { backgroundColor: '#FFF0F0', borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginHorizontal: 16, marginBottom: 32 },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#E63946' },
});