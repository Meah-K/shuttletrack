import React, { useEffect } from 'react';
 import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  const dot1 = new Animated.Value(0.3);
  const dot2 = new Animated.Value(0.3);
  const dot3 = new Animated.Value(0.3);

  useEffect(() => {
    // Animate loading dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          navigation.replace('Main');
        } else {
          navigation.replace('Onboarding');
        }
      } catch {
        navigation.replace('Onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {/* Icon box */}
      <View style={styles.iconBox}>
      <Ionicons name="bus" size={40} color="#1C6B2A" />
      </View>

      {/* App name */}
      <Text style={styles.appName}>ShuttleTrack</Text>
      <Text style={styles.tagline}>Know before you go</Text>

      {/* Loading dots */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconBox: {
    width: 80,
    height: 80,
    backgroundColor: '#EAF5EC',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  busEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C6B2A',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 40,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1C6B2A',
  },
});