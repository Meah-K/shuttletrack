import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const slides = [
  {
    id: 1,
    icon: 'bus',
    iconColor: '#1C6B2A',
    title: 'Track shuttles in real time',
    description:
      'See exactly where every campus shuttle is on the map — live, updated every 5 seconds.',
  },
  {
    id: 2,
    icon: 'walk',
    iconColor: '#1C6B2A',
    title: 'Walk or Wait — always know',
    description:
      'ShuttleTrack tells you whether to wait for the next shuttle or start walking to save time.',
  },

];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToLogin = () => navigation.replace('Login');

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const slide = slides[currentIndex];
  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeAreaView style={styles.container}>

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={goToLogin}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View style={styles.illustrationBox}>
<Ionicons name={slide.icon} size={80} color={slide.iconColor} />      </View>

      {/* Text */}
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.description}>{slide.description}</Text>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Main button */}
      <TouchableOpacity
        style={styles.mainBtn}
        onPress={isLastSlide ? goToLogin : goNext}
      >
        <Text style={styles.mainBtnText}>
          {isLastSlide ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>

      {/* Login link on last slide */}
      {isLastSlide && (
        <TouchableOpacity onPress={goToLogin} style={styles.loginRow}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  skipBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
  },
  illustrationBox: {
    width: 180,
    height: 180,
    borderRadius: 36,
    backgroundColor: '#EAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 36,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0CC',
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1C6B2A',
  },
  mainBtn: {
    backgroundColor: '#1C6B2A',
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginRow: {
    marginTop: 4,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  loginLink: {
    color: '#1C6B2A',
    fontWeight: '700',
  },
});