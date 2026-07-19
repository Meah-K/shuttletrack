import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  DriverError: undefined;
  DriverStatus: undefined;
};

type DriverErrorNavigationProp = StackNavigationProp<RootStackParamList, 'DriverError'>;

interface DriverErrorScreenProps {
  navigation: DriverErrorNavigationProp;
}

export default function DriverErrorScreen({ navigation }: DriverErrorScreenProps): React.JSX.Element {

  function handleRetry(): void {
    navigation.replace('DriverStatus');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.iconBox}>
          <Ionicons name="warning-outline" size={44} color="#E63946" />
        </View>
        <Text style={styles.title}>GPS unavailable</Text>
        <Text style={styles.message}>
          Your location is not being shared. Students cannot see your shuttle on the map.
        </Text>
        <View style={styles.warningBanner}>
          <Ionicons name="alert-circle-outline" size={14} color="#E63946" />
          <Text style={styles.warningText}>Status updates paused</Text>
        </View>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Ionicons name="refresh" size={16} color="#FFFFFF" />
          <Text style={styles.retryText}>Retry connection</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Check location permissions in your phone settings</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  iconBox: { width: 100, height: 100, backgroundColor: '#FFF0F0', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  message: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  warningBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF0F0', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 24 },
  warningText: { fontSize: 13, fontWeight: '600', color: '#E63946' },
  retryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1C6B2A', borderRadius: 50, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 12 },
  retryText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  hint: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
});