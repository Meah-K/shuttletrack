import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { routes, calculateDistanceKm, WALKING_SPEED_KMH } from '../mockData';

export default function WalkOrWaitScreen({ navigation, route }) {
  const { shuttle } = route.params;
  const [selectedStop, setSelectedStop] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  // Get stops for the shuttle's route
  const shuttleRoute = routes.find(r => r.routeId === shuttle.routeId);
  const stops = shuttleRoute ? shuttleRoute.stops : [];

  function calculate(stop) {
    setSelectedStop(stop);

    // Mock student location — center of KNUST campus
    const studentLat = 6.6736;
    const studentLng = -1.5727;

    const distanceKm = calculateDistanceKm(
      studentLat, studentLng,
      stop.latitude, stop.longitude
    );

    const walkingTimeMinutes = Math.round((distanceKm / WALKING_SPEED_KMH) * 60);
    const shuttleEta = shuttle.etaMinutes;

    if (!shuttleEta || shuttle.status === 'FULL' || shuttle.status === 'INACTIVE') {
      setRecommendation({
        result: 'WALK',
        walkingTime: walkingTimeMinutes,
        shuttleEta: null,
        distanceMeters: Math.round(distanceKm * 1000),
      });
    } else {
      setRecommendation({
        result: shuttleEta < walkingTimeMinutes ? 'WAIT' : 'WALK',
        walkingTime: walkingTimeMinutes,
        shuttleEta,
        distanceMeters: Math.round(distanceKm * 1000),
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.inner}>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Walk or Wait</Text>

        {/* Destination selector */}
        <Text style={styles.label}>Where are you going?</Text>
        <View style={styles.stopsContainer}>
          {stops.map((stop) => (
            <TouchableOpacity
              key={stop.stopId}
              style={[
                styles.stopOption,
                selectedStop?.stopId === stop.stopId && styles.stopOptionActive
              ]}
              onPress={() => calculate(stop)}
            >
              <Text style={[
                styles.stopOptionText,
                selectedStop?.stopId === stop.stopId && styles.stopOptionTextActive
              ]}>
                {stop.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Result */}
        {recommendation && (
          <View>
            <View style={[
              styles.resultBlock,
              recommendation.result === 'WAIT' ? styles.resultBlockGreen : styles.resultBlockRed
            ]}>
              <Text style={[
                styles.resultLabel,
                recommendation.result === 'WAIT' ? styles.resultLabelGreen : styles.resultLabelRed
              ]}>
                RECOMMENDATION
              </Text>
              <Text style={[
                styles.resultText,
                recommendation.result === 'WAIT' ? styles.resultTextGreen : styles.resultTextRed
              ]}>
                {recommendation.result === 'WAIT' ? 'Wait' : 'Walk'}
              </Text>
              <Text style={[
                styles.resultSub,
                recommendation.result === 'WAIT' ? styles.resultSubGreen : styles.resultSubRed
              ]}>
                {recommendation.result === 'WAIT'
                  ? `Shuttle arrives in ${recommendation.shuttleEta} min`
                  : `${recommendation.walkingTime} min on foot`}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>vs walking</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Walking card */}
            <View style={styles.comparisonCard}>
              <View style={styles.comparisonLeft}>
                <View style={styles.comparisonIcon}>
                  <Text style={styles.comparisonEmoji}>🚶</Text>
                </View>
                <View>
                  <Text style={styles.comparisonTitle}>Walking time</Text>
                  <Text style={styles.comparisonSub}>~{recommendation.distanceMeters}m away</Text>
                </View>
              </View>
              <Text style={styles.comparisonTime}>{recommendation.walkingTime} min</Text>
            </View>

            {/* Shuttle card */}
            <View style={styles.comparisonCard}>
              <View style={styles.comparisonLeft}>
                <View style={[styles.comparisonIcon, styles.comparisonIconGreen]}>
                  <Text style={styles.comparisonEmoji}>🚌</Text>
                </View>
                <View>
                  <Text style={styles.comparisonTitle}>{shuttle.routeName}</Text>
                  <Text style={styles.comparisonSub}>
                    {shuttle.status === 'HAS_SPACE' ? 'Has space · arriving soon' : 'No space available'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.comparisonTime, styles.comparisonTimeGreen]}>
                {recommendation.shuttleEta ? `${recommendation.shuttleEta} min` : 'N/A'}
              </Text>
            </View>

            {/* Recalculate */}
            <TouchableOpacity
              style={styles.recalcButton}
              onPress={() => setRecommendation(null)}
            >
              <Text style={styles.recalcButtonText}>Recalculate</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  inner: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0DC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  stopsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  stopOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stopOptionActive: {
    backgroundColor: '#EAF5EC',
    borderColor: '#1C6B2A',
  },
  stopOptionText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  stopOptionTextActive: {
    color: '#1C6B2A',
    fontWeight: '700',
  },
  resultBlock: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultBlockGreen: { backgroundColor: '#EAF5EC' },
  resultBlockRed: { backgroundColor: '#FFF0F0' },
  resultLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  resultLabelGreen: { color: '#1C6B2A' },
  resultLabelRed: { color: '#E63946' },
  resultText: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultTextGreen: { color: '#1C6B2A' },
  resultTextRed: { color: '#E63946' },
  resultSub: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultSubGreen: { color: '#2D8A3E' },
  resultSubRed: { color: '#E63946' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0DC',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0DC',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  comparisonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  comparisonIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonIconGreen: {
    backgroundColor: '#EAF5EC',
  },
  comparisonEmoji: {
    fontSize: 18,
  },
  comparisonTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  comparisonSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  comparisonTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  comparisonTimeGreen: {
    color: '#1C6B2A',
  },
  recalcButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1C6B2A',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  recalcButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C6B2A',
  },
});