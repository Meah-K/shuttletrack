import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GPSIndicator from '../../components/GPSIndicator';
import { colors, radius, spacing, typography } from '../../theme/colors';

type ShuttleStatus = 'HAS_SPACE' | 'FULL';

interface Props {
  navigation: { replace: (screen: string) => void };
}

export default function DriverStatusScreen(_props: Props) {
  const [status, setStatus] = useState<ShuttleStatus>('HAS_SPACE');

  function toggleStatus() {
    const next: ShuttleStatus = status === 'HAS_SPACE' ? 'FULL' : 'HAS_SPACE';
    setStatus(next);
  }

  const isHasSpace = status === 'HAS_SPACE';
  const cardColor = isHasSpace ? colors.primary : colors.danger;
  const statusText = isHasSpace ? 'HAS\nSPACE' : 'FULL';
  const hintText = isHasSpace ? 'Tap to mark as full' : 'Tap to mark as available';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <TouchableOpacity activeOpacity={0.9} onPress={toggleStatus} style={styles.touchArea}>
          <View style={styles.circle}>
            <Text style={[styles.circleText, { color: cardColor }]}>{statusText}</Text>
          </View>
          <Text style={styles.hint}>{hintText}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gpsArea}>
        <GPSIndicator routeName="Route A" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  card: {
    flex: 1, margin: spacing.lg, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  touchArea: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  circle: {
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  circleText: { ...typography.display, fontSize: 32, textAlign: 'center' },
  hint: { ...typography.body, color: '#FFFFFF', marginTop: spacing.lg, opacity: 0.95 },
  gpsArea: { paddingBottom: spacing.lg, alignItems: 'center' },
});