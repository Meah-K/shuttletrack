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
  Error: undefined;
};

type ErrorNavigationProp = StackNavigationProp<RootStackParamList, 'Error'>;

interface ErrorScreenProps {
  navigation: ErrorNavigationProp;
}

export default function ErrorScreen({ navigation }: ErrorScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.iconBox}>
          <Ionicons name="wifi-outline" size={44} color="#E63946" />
        </View>
        <Text style={styles.title}>Can't connect</Text>
        <Text style={styles.subtitle}>
          Check your internet connection and try again. Shuttle data may be out of date.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
        <Text style={styles.lastUpdated}>Last updated: 3 min ago</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  iconBox: { width: 100, height: 100, backgroundColor: '#FFF0F0', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  button: { backgroundColor: '#E63946', borderRadius: 50, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 12 },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  lastUpdated: { fontSize: 12, color: '#6B7280' },
});