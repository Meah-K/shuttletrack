import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import type { Business } from '../utils/api';

type RootStackParamList = {
  BusinessDetail: { business: Business };
};

type BusinessDetailRouteProp = RouteProp<RootStackParamList, 'BusinessDetail'>;

interface BusinessDetailScreenProps {
  route: BusinessDetailRouteProp;
  navigation: any;
}

export default function BusinessDetailScreen({ route, navigation }: BusinessDetailScreenProps): React.JSX.Element {
  const { business } = route.params;

  function renderStars(rating: number): string {
    const full = Math.floor(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={[styles.heroBanner, { backgroundColor: business.color }]}>
          <View style={styles.heroIconCircle}>
            <Ionicons name={business.icon as any} size={40} color={business.color} />
          </View>
          <Text style={styles.heroName}>{business.name}</Text>
          <Text style={styles.heroCategory}>{business.category}</Text>
        </View>

        {/* Stat row — reuses fields you already have, no new backend data needed */}
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Ionicons name="star" size={18} color="#F4A261" />
            <Text style={styles.statValue}>{business.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="walk" size={18} color="#1C6B2A" />
            <Text style={styles.statValue}>{business.distance}</Text>
            <Text style={styles.statLabel}>Walk time</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="location" size={18} color="#1C6B2A" />
            <Text style={styles.statValue} numberOfLines={1}>{business.nearStop}</Text>
            <Text style={styles.statLabel}>Nearest stop</Text>
          </View>
        </View>

        {/* Rating breakdown card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.starsBig}>{renderStars(business.rating)}</Text>
            <Text style={styles.ratingNumber}>{business.rating} / 5</Text>
          </View>
        </View>

        {/* Deal — enlarged into its own full-width section instead of a small pill */}
        {business.deal ? (
          <View style={styles.dealSection}>
            <View style={styles.dealHeader}>
              <Ionicons name="pricetag" size={18} color="#1C6B2A" />
              <Text style={styles.dealHeaderText}>Current deal</Text>
            </View>
            <Text style={styles.dealBody}>{business.deal}</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.noDealRow}>
              <Ionicons name="pricetag-outline" size={18} color="#9CA3AF" />
              <Text style={styles.noDealText}>No active deals right now — check back later.</Text>
            </View>
          </View>
        )}

        {/* Location section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getting there</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#1C6B2A" />
            <Text style={styles.locationText}>
              Nearest stop: <Text style={styles.locationBold}>{business.nearStop}</Text>
            </Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="walk" size={16} color="#1C6B2A" />
            <Text style={styles.locationText}>
              About <Text style={styles.locationBold}>{business.distance}</Text> on foot from that stop
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC' },
  backButton: { width: 36, height: 36, backgroundColor: '#F7F8F5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  content: { padding: 16, paddingBottom: 40 },

  heroBanner: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  heroIconCircle: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroName: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
  heroCategory: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

  statRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 14, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  statLabel: { fontSize: 10, color: '#6B7280', textAlign: 'center' },

  section: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 0.5, borderColor: '#E0E0DC', padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  starsBig: { fontSize: 22, color: '#F4A261' },
  ratingNumber: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },

  dealSection: { backgroundColor: '#EAF5EC', borderRadius: 16, padding: 16, marginBottom: 16 },
  dealHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dealHeaderText: { fontSize: 13, fontWeight: '700', color: '#1C6B2A', textTransform: 'uppercase', letterSpacing: 0.5 },
  dealBody: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', lineHeight: 21 },

  noDealRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noDealText: { fontSize: 13, color: '#9CA3AF', flex: 1 },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  locationText: { fontSize: 13, color: '#6B7280', flex: 1 },
  locationBold: { fontWeight: '700', color: '#1A1A1A' },
});