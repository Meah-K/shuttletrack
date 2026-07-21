import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { currentDriver } from '../mockData';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  DriverProfile: undefined;
  DriverLogin: undefined;
};

type DriverProfileNavigationProp = StackNavigationProp<RootStackParamList, 'DriverProfile'>;

interface DriverProfileScreenProps {
  navigation: DriverProfileNavigationProp;
}

export default function DriverProfileScreen({ navigation }: DriverProfileScreenProps): React.JSX.Element {

  function handleLogout(): void {
    navigation.reset({
      index: 0,
      routes: [{ name: 'DriverLogin' }],
    });
  }

  const initial = currentDriver.name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Driver profile</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{currentDriver.name}</Text>
          <Text style={styles.role}>Driver</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned route</Text>
            <Text style={styles.infoValue}>Route A — KSB</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shuttle ID</Text>
            <Text style={styles.infoValue}>{currentDriver.shuttleId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{currentDriver.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#E63946" />
          <Text style={styles.logoutText}>End shift & log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginBottom: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EAF5EC', borderWidth: 2, borderColor: '#1C6B2A', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#1C6B2A' },
  name: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  role: { fontSize: 14, color: '#6B7280' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 0.5, borderColor: '#E0E0DC', overflow: 'hidden', marginBottom: 16 },
  infoRow: { padding: 14, gap: 3 },
  infoLabel: { fontSize: 11, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  divider: { height: 0.5, backgroundColor: '#F0F0EC', marginLeft: 14 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFF0F0', borderRadius: 50, paddingVertical: 16, marginBottom: 32 },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#E63946' },
});