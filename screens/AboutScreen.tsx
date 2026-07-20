import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ProfileMain: undefined;
  About: undefined;
};

type AboutNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;

interface AboutScreenProps {
  navigation: AboutNavigationProp;
}

export default function AboutScreen({ navigation }: AboutScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About ShuttleTrack</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoBox}>
          <Ionicons name="bus" size={40} color="#1C6B2A" />
        </View>

        <Text style={styles.appName}>ShuttleTrack</Text>
        <Text style={styles.version}>Version 1.0.0</Text>

        <Text style={styles.description}>
          ShuttleTrack helps KNUST students track campus shuttles in real time,
          see live shuttle availability, and decide whether to walk or wait —
          all in one place.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Built by Group 7</Text>
          <Text style={styles.cardText}>CodeQuest 2026 · KNUST</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC', gap: 12 },
  backButton: { width: 36, height: 36, backgroundColor: '#F7F8F5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  content: { padding: 24, alignItems: 'center' },
  logoBox: { width: 80, height: 80, backgroundColor: '#EAF5EC', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 16 },
  appName: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  version: { fontSize: 13, color: '#6B7280', marginBottom: 24 },
  description: { fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 16, alignItems: 'center', width: '100%' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  cardText: { fontSize: 13, color: '#6B7280' },
});