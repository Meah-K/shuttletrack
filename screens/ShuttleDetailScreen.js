import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function ShuttleDetailScreen({ navigation, route }) {
  const { shuttle } = route.params;

  function getStatusLabel(status) {
    if (status === 'HAS_SPACE') return 'Has space';
    if (status === 'FULL') return 'Full';
    return 'Inactive';
  }

  function getBadgeStyle(status) {
    if (status === 'HAS_SPACE') return styles.badgeGreen;
    if (status === 'FULL') return styles.badgeRed;
    return styles.badgeGrey;
  }

  function getBadgeTextStyle(status) {
    if (status === 'HAS_SPACE') return styles.badgeTextGreen;
    if (status === 'FULL') return styles.badgeTextRed;
    return styles.badgeTextGrey;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Route header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.routeName}>{shuttle.routeName}</Text>
            <Text style={styles.routeSub}>Shuttle #{shuttle.shuttleId} · 3 stops</Text>
          </View>
          <View style={[styles.badge, getBadgeStyle(shuttle.status)]}>
            <Text style={getBadgeTextStyle(shuttle.status)}>
              {getStatusLabel(shuttle.status)}
            </Text>
          </View>
        </View>

        {/* ETA block */}
        <View style={styles.etaBlock}>
          <View>
            <Text style={styles.etaLabel}>NEXT ARRIVAL</Text>
            <Text style={styles.etaValue}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes} min` : 'N/A'}
            </Text>
          </View>
          <View style={styles.etaRight}>
            <Text style={styles.etaSubLabel}>Last updated</Text>
            <Text style={styles.etaSubValue}>{shuttle.lastUpdated}</Text>
          </View>
        </View>

        {/* Upcoming stops */}
        <Text style={styles.sectionTitle}>Upcoming stops</Text>
        <View style={styles.stopsList}>
          <View style={styles.stopRow}>
            <View style={[styles.stopDot, styles.stopDotActive]} />
            <View style={styles.stopInfo}>
              <Text style={styles.stopName}>Main Gate</Text>
              <Text style={styles.stopSub}>Next stop</Text>
            </View>
            <Text style={styles.stopEta}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes} min` : 'N/A'}
            </Text>
          </View>
          <View style={styles.stopConnector} />
          <View style={styles.stopRow}>
            <View style={styles.stopDot} />
            <View style={styles.stopInfo}>
              <Text style={styles.stopNameMuted}>Unity Hall</Text>
            </View>
            <Text style={styles.stopEtaMuted}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes + 5} min` : 'N/A'}
            </Text>
          </View>
          <View style={styles.stopConnector} />
          <View style={styles.stopRow}>
            <View style={styles.stopDot} />
            <View style={styles.stopInfo}>
              <Text style={styles.stopNameMuted}>SRC Bus Stop</Text>
            </View>
            <Text style={styles.stopEtaMuted}>
              {shuttle.etaMinutes ? `${shuttle.etaMinutes + 10} min` : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Walk or Wait CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('WalkOrWait', { shuttle })}
        >
          <Text style={styles.ctaButtonText}>Walk or Wait? →</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F7F8F5',
    borderWidth: 1,
    borderColor: '#E0E0DC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  routeSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  badgeGreen: { backgroundColor: '#EAF5EC' },
  badgeRed: { backgroundColor: '#FFF0F0' },
  badgeGrey: { backgroundColor: '#F3F4F6' },
  badgeTextGreen: { fontSize: 11, fontWeight: '700', color: '#1C6B2A' },
  badgeTextRed: { fontSize: 11, fontWeight: '700', color: '#E63946' },
  badgeTextGrey: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  etaBlock: {
    backgroundColor: '#EAF5EC',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  etaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C6B2A',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  etaValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C6B2A',
  },
  etaRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  etaSubLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  etaSubValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  stopsList: {
    marginBottom: 24,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D0D0CC',
    flexShrink: 0,
  },
  stopDotActive: {
    backgroundColor: '#1C6B2A',
  },
  stopConnector: {
    width: 1.5,
    height: 20,
    backgroundColor: '#D0D0CC',
    marginLeft: 5,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  stopNameMuted: {
    fontSize: 13,
    color: '#6B7280',
  },
  stopSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  stopEta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C6B2A',
  },
  stopEtaMuted: {
    fontSize: 13,
    color: '#6B7280',
  },
  ctaButton: {
    backgroundColor: '#1C6B2A',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});