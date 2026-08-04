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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: business.color + '20' }]}>
          <Ionicons name={business.icon as any} size={40} color={business.color} />
        </View>
        <Text style={styles.name}>{business.name}</Text>
        <Text style={styles.rating}>
          <Text style={{ color: '#F4A261' }}>{renderStars(business.rating)}</Text> {business.rating}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.metaText}>{business.nearStop}</Text>
          <Text style={styles.dot}>·</Text>
          <Ionicons name="walk-outline" size={14} color="#6B7280" />
          <Text style={styles.metaText}>{business.distance}</Text>
        </View>
        {business.deal && (
          <View style={styles.dealBox}>
            <Ionicons name="pricetag" size={14} color="#1C6B2A" />
            <Text style={styles.dealText}>{business.deal}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  content: { alignItems: 'center', padding: 24, gap: 10 },
  iconCircle: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  rating: { fontSize: 14, color: '#6B7280' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: 13, color: '#6B7280' },
  dot: { fontSize: 13, color: '#D0D0CC' },
  dealBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EAF5EC', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginTop: 12 },
  dealText: { fontSize: 13, fontWeight: '600', color: '#1C6B2A' },
});