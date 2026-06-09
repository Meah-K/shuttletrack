import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

export default function DriverStatusScreen({ navigation }) {
  const [status, setStatus] = useState('HAS_SPACE');
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [seconds, setSeconds] = useState(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Simulate GPS update every 10 seconds
    const interval = setInterval(() => {
      setSeconds(prev => {
        const newVal = prev + 10;
        setLastUpdated(`${newVal} seconds ago`);
        return newVal;
      });
    }, 10000);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    return () => clearInterval(interval);
  }, []);

  function toggleStatus() {
    setStatus(prev => prev === 'HAS_SPACE' ? 'FULL' : 'HAS_SPACE');
    setLastUpdated('Just now');
    setSeconds(0);
  }

  const isAvailable = status === 'HAS_SPACE';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isAvailable ? '#1C6B2A' : '#E63946' }]}>

      {/* Profile button top right */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('DriverProfile')}
      >
        <Text style={styles.profileButtonText}>👤</Text>
      </TouchableOpacity>

      <View style={styles.inner}>

        {/* Main toggle button */}
        <TouchableOpacity onPress={toggleStatus} activeOpacity={0.9}>
          <Animated.View style={[styles.outerRing, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.innerCircle}>
              <Text style={[styles.statusText, { color: isAvailable ? '#1C6B2A' : '#E63946' }]}>
                {isAvailable ? 'HAS\nSPACE' : 'FULL'}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Hint text */}
        <Text style={styles.hintText}>
          {isAvailable ? 'Tap to mark as full' : 'Tap to mark as available'}
        </Text>

        {/* GPS banner */}
        <View style={styles.gpsBanner}>
          <View style={styles.gpsDot} />
          <Text style={styles.gpsText}>GPS active · Route A · {lastUpdated}</Text>
        </View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  profileButtonText: {
    fontSize: 20,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 152,
    height: 152,
    borderRadius: 76,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  hintText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  gpsBanner: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#90EE90',
  },
  gpsText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});