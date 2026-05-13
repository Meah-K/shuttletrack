import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export default function SplashScreen({ navigation }) {
 
  useEffect(() => {
    // Start a 2-second timer as soon as this screen appears
    const timer = setTimeout(async () => {
 
      // Check if the user has a saved login token
      const token = await AsyncStorage.getItem('userToken');
 
      if (token) {
        // They have logged in before — send them straight to Home
        navigation.replace('Home');
      } else {
        // First time using the app — show Onboarding
        navigation.replace('Onboarding');
      }
 
    }, 2000); // 2000 milliseconds = 2 seconds
 
    // Clean up: cancel the timer if the screen closes before 2 seconds
    return () => clearTimeout(timer);
 
  }, []); // The empty [] means: run this only once when the screen opens
 
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ShuttleTrack</Text>
      <Text style={styles.tagline}>KNUST Campus Shuttle Tracker</Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,                     // Take up the full screen
    backgroundColor: '#1E8449',  // Dark green background
    alignItems: 'center',        // Center horizontally
    justifyContent: 'center',    // Center vertically
  },
  logo: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 16,
    color: '#A9DFBF',
    marginTop: 12,
  },
});