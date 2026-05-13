import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Dimensions
} from 'react-native';
 
// Dimensions.get('window').width gives us the phone's screen width
// so we can make layouts that work on any phone size
const { width } = Dimensions.get('window');
 
// The 2 slides — each has a title, description, and an emoji placeholder
// (Ama's Figma designs will have real illustrations — swap the emoji later)
const slides = [
  {
    id: 1,
    emoji: '🚌',
    title: 'Track Live Shuttles',
    description:
      'See exactly where every campus shuttle is in real time. ' +
      'No more arriving at a stop and not knowing if a shuttle is coming.',
  },
  {
    id: 2,
    emoji: '🚶',
    title: 'Walk or Wait?',
    description:
      'ShuttleTrack calculates whether waiting for the next shuttle ' +
      'is faster than walking. One tap and you know.',
  },
];
 
export default function OnboardingScreen({ navigation }) {
  // currentIndex tracks which slide we are on (0 = first, 1 = second)
  const [currentIndex, setCurrentIndex] = useState(0);
 
  // Navigate to the Login screen
  const goToLogin = () => navigation.replace('Login');
 
  // Move to the next slide
  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
 
  const slide = slides[currentIndex];
  const isLastSlide = currentIndex === slides.length - 1;
 
  return (
    <View style={styles.container}>
 
      {/* SKIP button — top right corner */}
      <TouchableOpacity style={styles.skipBtn} onPress={goToLogin}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
 
      {/* Illustration circle */}
      <View style={styles.illustrationCircle}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
      </View>
 
      {/* Slide text */}
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.description}>{slide.description}</Text>
 
      {/* Dot indicators — one dot per slide */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.activeDot, // wider dot for current slide
            ]}
          />
        ))}
      </View>
 
      {/* Main button — says Next on slide 1, Get Started on slide 2 */}
      <TouchableOpacity
        style={styles.mainBtn}
        onPress={isLastSlide ? goToLogin : goNext}
      >
        <Text style={styles.mainBtnText}>
          {isLastSlide ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
 
    </View>
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
    position: 'absolute', // floats over other content
    top: 52,
    right: 24,
  },
  skipText: {
    color: '#7F8C8D',
    fontSize: 16,
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,         // makes it a circle
    backgroundColor: '#EAF9EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  emoji: { fontSize: 80 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A5276',
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    color: '#5D6D7E',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 36,
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 36,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#BDC3C7',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#1E8449',
    width: 28,              // active dot is wider to show progress
    borderRadius: 5,
  },
  mainBtn: {
    backgroundColor: '#1E8449',
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 32,
  },
  mainBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});