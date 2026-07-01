import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/colors';

interface Props {
  active?: boolean;
  lastUpdated?: string;
}

export default function GPSIndicator({ active = true, lastUpdated = '...' }: Props) {
  const pulseOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      pulseOpacity.setValue(0.3);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulseOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { opacity: pulseOpacity }]} />
      <Text style={styles.text}>GPS {active ? 'active' : 'inactive'}</Text>
      {active && (
        <>
          <Text style={styles.separator}> · </Text>
          <Text style={styles.route}>Last updated {lastUpdated}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.primary, marginRight: spacing.sm,
  },
  text: { ...typography.bodyBold, fontSize: 14, color: colors.primaryDark },
  separator: { ...typography.body, fontSize: 14, color: colors.textSecondary },
  route: { ...typography.label, fontSize: 14, color: colors.textSecondary },
});
