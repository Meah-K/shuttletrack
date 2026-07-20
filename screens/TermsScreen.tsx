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
  Terms: undefined;
};

type TermsNavigationProp = StackNavigationProp<RootStackParamList, 'Terms'>;

interface TermsScreenProps {
  navigation: TermsNavigationProp;
}

export default function TermsScreen({ navigation }: TermsScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Terms of Use</Text>
        <Text style={styles.paragraph}>
          ShuttleTrack is a student project built for CodeQuest 2026 at KNUST.
          It is intended for demonstration purposes to help students and
          drivers track campus shuttle availability and location in real time.
        </Text>

        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.paragraph}>
          Student accounts store your name, student ID, and email for
          authentication purposes. Driver accounts share live GPS location
          while actively signed in, so students can see shuttle positions on
          the map. Location sharing stops once a driver logs out.
        </Text>

        <Text style={styles.paragraph}>
          This app is a class project and not intended for production use
          beyond CodeQuest 2026 demonstration purposes.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC', gap: 12 },
  backButton: { width: 36, height: 36, backgroundColor: '#F7F8F5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  content: { padding: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 8, marginTop: 16 },
  paragraph: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 8 },
});