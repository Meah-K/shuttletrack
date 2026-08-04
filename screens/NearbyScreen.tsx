import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNearbyBusinesses } from '../utils/api';
import type { Business } from '../utils/api';
import type { StackNavigationProp } from '@react-navigation/stack';

// ─── TYPES ───────────────────────────────────────────────────
type RootStackParamList = {
  Nearby: undefined;
  BusinessDetail: { business: Business };
};

type NearbyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Nearby'>;

interface NearbyScreenProps {
  navigation: NearbyScreenNavigationProp;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'drinks', label: 'Drinks', icon: 'cafe' },
  { id: 'shopping', label: 'Shopping', icon: 'bag' },
  { id: 'services', label: 'Services', icon: 'briefcase' },
  { id: 'health', label: 'Health', icon: 'medical' },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function NearbyScreen({ navigation }: NearbyScreenProps): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function loadBusinesses() {
      try {
        const data = await getNearbyBusinesses();

console.log("BUSINESSES FROM API:", data);

if (isMounted) {
  setBusinesses(data);
  setError(null);
}
      } catch (err) {
        if (isMounted) setError('Could not load nearby places');
        console.log(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBusinesses();
    return () => { isMounted = false; };
  }, []);

  const filtered = businesses.filter(b => {
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.nearStop.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function renderStars(rating: number): string {
    const full = Math.floor(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nearby</Text>
        <Text style={styles.subtitle}>Businesses near your shuttle stops</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search businesses or stops..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryPill,
              selectedCategory === cat.id && styles.categoryPillActive
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon as any}
              size={14}
              color={selectedCategory === cat.id ? '#FFFFFF' : '#6B7280'}
            />
            <Text style={[
              styles.categoryLabel,
              selectedCategory === cat.id && styles.categoryLabelActive
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <Text style={styles.resultsCount}>
        {filtered.length} {filtered.length === 1 ? 'place' : 'places'} found
      </Text>

      {/* Business list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading nearby places…</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle" size={40} color="#D0D0CC" />
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={40} color="#D0D0CC" />
            <Text style={styles.emptyText}>No businesses found</Text>
            <Text style={styles.emptySub}>Try a different category or search term</Text>
          </View>
        ) : (
          filtered.map(business => (
            <TouchableOpacity
              key={business.id}
              style={styles.businessCard}
              onPress={() => navigation.navigate('BusinessDetail', { business })}
            >

              {/* Icon */}
              <View style={[styles.businessIcon, { backgroundColor: business.color + '20' }]}>
                <Ionicons name={business.icon as any} size={24} color={business.color} />
              </View>

              {/* Info */}
              <View style={styles.businessInfo}>
                <View style={styles.businessTop}>
                  <Text style={styles.businessName}>{business.name}</Text>
                  <Text style={styles.businessRating}>
                    <Text style={styles.stars}>{renderStars(business.rating)}</Text>
                    {' '}{business.rating}
                  </Text>
                </View>

                <View style={styles.businessMeta}>
                  <Ionicons name="location-outline" size={11} color="#6B7280" />
                  <Text style={styles.businessStop}>{business.nearStop}</Text>
                  <Text style={styles.businessDot}>·</Text>
                  <Ionicons name="walk-outline" size={11} color="#6B7280" />
                  <Text style={styles.businessDistance}>{business.distance}</Text>
                </View>

                {/* Deal badge */}
                {business.deal && (
                  <View style={styles.dealBadge}>
                    <Ionicons name="pricetag" size={10} color="#1C6B2A" />
                    <Text style={styles.dealText}>{business.deal}</Text>
                  </View>
                )}
              </View>

              <Ionicons name="chevron-forward" size={16} color="#D0D0CC" />

            </TouchableOpacity>
          ))
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0DC',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E0E0DC',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  categoryRow: {
    marginTop: 10,
    marginBottom: 4,
    flexGrow: 0,
    flexShrink: 0,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0DC',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    height: 36,
  },
  categoryPillActive: {
    backgroundColor: '#1C6B2A',
    borderColor: '#1C6B2A',
  },
  categoryLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultsCount: {
    fontSize: 12,
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  businessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E0E0DC',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  businessIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  businessInfo: {
    flex: 1,
    gap: 4,
  },
  businessTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  businessName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  businessRating: {
    fontSize: 11,
    color: '#6B7280',
  },
  stars: {
    color: '#F4A261',
    fontSize: 11,
  },
  businessMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  businessStop: {
    fontSize: 11,
    color: '#6B7280',
  },
  businessDot: {
    fontSize: 11,
    color: '#D0D0CC',
  },
  businessDistance: {
    fontSize: 11,
    color: '#6B7280',
  },
  dealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF5EC',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  dealText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1C6B2A',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});