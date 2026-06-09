import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ShuttleDetailScreen({ navigation, route }) {
  const { shuttle } = route.params;

  function getStatusLabel(status) {
    if (status === 'HAS_SPACE') return 'Has space';
    if (status === 'FULL') return 'Full';
    return 'Inactive';
  }

  function getStatusColor(status) {
    if (status === 'HAS_SPACE') return '#1C6B2A';
    if (status === 'FULL') return '#E63946';
    return '#6B7280';
  }

  function getStatusBg(status) {
    if (status === 'HAS_SPACE') return '#EAF5EC';
    if (status === 'FULL') return '#FFF0F0';
    return '#F3F4F6';
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{shuttle.routeName}</Text>
          <Text style={styles.headerSub}>Shuttle #{shuttle.shuttleId}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: getStatusBg(shuttle.status) }]}>
          <Text style={[styles.statusPillText, { color: getStatusColor(shuttle.status) }]}>
            {getStatusLabel(shuttle.status)}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ETA hero */}
        <View style={styles.etaHero}>
          <View style={styles.etaLeft}>
            <Text style={styles.etaLabel}>NEXT ARRIVAL</Text>
            <Text style={styles.etaValue}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes} min` : 'N/A'}
            </Text>
            <Text style={styles.etaUpdated}>Updated {shuttle.lastUpdated}</Text>
          </View>
          <View style={styles.etaIconBox}>
            <Ionicons name="bus" size={48} color="rgba(255,255,255,0.3)" />
          </View>
        </View>

        {/* Upcoming stops */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming stops</Text>
          <View style={styles.stopRow}>
            <View style={styles.stopIndicator}>
              <View style={styles.stopDotActive} />
              <View style={styles.stopLine} />
            </View>
            <View style={styles.stopContent}>
              <Text style={styles.stopName}>Main Gate</Text>
              <Text style={styles.stopType}>Next stop</Text>
            </View>
            <Text style={styles.stopEtaActive}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes} min` : 'N/A'}
            </Text>
          </View>
          <View style={styles.stopRow}>
            <View style={styles.stopIndicator}>
              <View style={styles.stopDot} />
              <View style={styles.stopLine} />
            </View>
            <View style={styles.stopContent}>
              <Text style={styles.stopNameMuted}>Unity Hall</Text>
            </View>
            <Text style={styles.stopEta}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes + 5} min` : 'N/A'}
            </Text>
          </View>
          <View style={styles.stopRow}>
            <View style={styles.stopIndicator}>
              <View style={styles.stopDot} />
            </View>
            <View style={styles.stopContent}>
              <Text style={styles.stopNameMuted}>SRC Bus Stop</Text>
            </View>
            <Text style={styles.stopEta}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes + 10} min` : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Info cards row */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="location" size={20} color="#1C6B2A" />
            <Text style={styles.infoValue}>On route</Text>
            <Text style={styles.infoLabel}>Status</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color="#1C6B2A" />
            <Text style={styles.infoValue}>{shuttle.lastUpdated}</Text>
            <Text style={styles.infoLabel}>Last updated</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="bus" size={20} color="#1C6B2A" />
            <Text style={styles.infoValue}>3 stops</Text>
            <Text style={styles.infoLabel}>Remaining</Text>
          </View>
        </View>

        {/* Walk or Wait CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('WalkOrWait', { shuttle })}
        >
          <Ionicons name="walk" size={20} color="#FFFFFF" />
          <Text style={styles.ctaText}>Walk or Wait?</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0DC',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F7F8F5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  etaHero: {
    backgroundColor: '#1C6B2A',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etaLeft: {
    gap: 4,
  },
  etaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.8,
  },
  etaValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 56,
  },
  etaUpdated: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  etaIconBox: {
    opacity: 0.6,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E0E0DC',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  stopRow: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 44,
  },
  stopIndicator: {
    width: 12,
    alignItems: 'center',
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D0D0CC',
    marginTop: 4,
  },
  stopDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1C6B2A',
    marginTop: 4,
  },
  stopLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0DC',
    marginTop: 4,
  },
  stopContent: {
    flex: 1,
    gap: 2,
    paddingBottom: 12,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  stopNameMuted: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  stopType: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  stopEta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  stopEtaActive: {
    fontSize: 13,
    color: '#1C6B2A',
    fontWeight: '600',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#E0E0DC',
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#1C6B2A',
    borderRadius: 50,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});