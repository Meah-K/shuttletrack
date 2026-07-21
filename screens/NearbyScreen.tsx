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

// ─── TYPES ───────────────────────────────────────────────────
interface Business {
  id: string;
  name: string;
  category: string;
  distance: string;
  nearStop: string;
  deal: string | null;
  rating: number;
  icon: string;
  color: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'drinks', label: 'Drinks', icon: 'cafe' },
  { id: 'shopping', label: 'Shopping', icon: 'bag' },
  { id: 'services', label: 'Services', icon: 'briefcase' },
  { id: 'health', label: 'Health', icon: 'medical' },
];

const BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Chicken Republic',
    category: 'food',
    distance: '2 min walk',
    nearStop: 'Paa Joe Junction',
    deal: '10% off with code SHUTTLE10',
    rating: 4.5,
    icon: 'restaurant',
    color: '#E63946',
  },
  {
    id: '2',
    name: 'Papaye Restaurant',
    category: 'food',
    distance: '3 min walk',
    nearStop: 'KSB',
    deal: 'Free drink with any meal today',
    rating: 4.3,
    icon: 'fast-food',
    color: '#F4A261',
  },
  {
    id: '3',
    name: 'KNUST Print Shop',
    category: 'services',
    distance: '1 min walk',
    nearStop: 'SRC Bus Stop',
    deal: '50 pages for GHS 5 only',
    rating: 4.0,
    icon: 'print',
    color: '#2E5F8A',
  },
  {
    id: '4',
    name: 'Campus Café',
    category: 'drinks',
    distance: '4 min walk',
    nearStop: 'Unity Hall',
    deal: null,
    rating: 4.7,
    icon: 'cafe',
    color: '#6B4226',
  },
  {
    id: '5',
    name: 'Healthy Bites',
    category: 'food',
    distance: '5 min walk',
    nearStop: 'KSB',
    deal: 'Buy 2 get 1 free on smoothies',
    rating: 4.6,
    icon: 'leaf',
    color: '#1C6B2A',
  },
  {
    id: '6',
    name: 'Campus Pharmacy',
    category: 'health',
    distance: '2 min walk',
    nearStop: 'SRC Bus Stop',
    deal: null,
    rating: 4.4,
    icon: 'medical',
    color: '#E63946',
  },
  {
    id: '7',
    name: 'KNUST Bookshop',
    category: 'shopping',
    distance: '3 min walk',
    nearStop: 'Unity Hall',
    deal: '5% off stationery this week',
    rating: 4.2,
    icon: 'book',
    color: '#9B59B6',
  },
  {
    id: '8',
    name: 'MTN Service Centre',
    category: 'services',
    distance: '6 min walk',
    nearStop: 'KSB',
    deal: null,
    rating: 3.9,
    icon: 'phone-portrait',
    color: '#F4A261',
  },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function NearbyScreen(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = BUSINESSES.filter(b => {
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
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={40} color="#D0D0CC" />
            <Text style={styles.emptyText}>No businesses found</Text>
            <Text style={styles.emptySub}>Try a different category or search term</Text>
          </View>
        ) : (
          filtered.map(business => (
            <TouchableOpacity key={business.id} style={styles.businessCard}>

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