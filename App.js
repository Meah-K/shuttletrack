import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
// ── YOUR SCREENS (Mirabelle) ─────────────────────────────────────
import SplashScreen       from './screens/SplashScreen';
import OnboardingScreen   from './screens/OnboardingScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import DriverProfileScreen from './screens/DriverProfileScreen';
import DriverErrorScreen  from './screens/DriverErrorScreen';
 
// ── AMA'S SCREENS ────────────────────────────────────────────────
// Comment these out until Ama pushes her files:
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen  from './screens/HomeScreen';
 
// ── SALMA'S SCREENS ──────────────────────────────────────────────
// Comment these out until Salma pushes her files:
// import DriverLoginScreen  from './screens/DriverLoginScreen';
// import DriverStatusScreen from './screens/DriverStatusScreen';
 
// ── SHILA'S SCREENS ──────────────────────────────────────────────
// Comment these out until Shila pushes her files:
// import WalkOrWaitScreen from './screens/WalkOrWaitScreen';
// import RoutesListScreen from './screens/RoutesListScreen';
 
const Stack = createNativeStackNavigator();
 
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    // Check if the user is already logged in
    const checkLoginState = async () => {
      // We read the token here just to check it exists
      // (We do not use it yet — that is the backend's job later)
      await AsyncStorage.getItem('userToken');
      setIsLoading(false);
    };
    checkLoginState();
  }, []);
 
  // Show a spinner while checking login state
  if (isLoading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#1E8449" />
      </View>
    );
  }
 
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
        // headerShown: false removes the default navigation bar at the top of every screen
      >
        {/* ── YOUR SCREENS ─────────────────────────────── */}
        <Stack.Screen name="Splash"        component={SplashScreen} />
        <Stack.Screen name="Onboarding"    component={OnboardingScreen} />
        <Stack.Screen name="Registration"  component={RegistrationScreen} />
        <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
        <Stack.Screen name="DriverError"   component={DriverErrorScreen} />
 
        {/* ── AMA'S SCREENS — uncomment when she pushes ── */}
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        {/* <Stack.Screen name="Home"  component={HomeScreen} /> */}
 
        {/* ── SALMA'S SCREENS — uncomment when she pushes ── */}
        {/* <Stack.Screen name="DriverLogin"  component={DriverLoginScreen} /> */}
        {/* <Stack.Screen name="DriverStatus" component={DriverStatusScreen} /> */}
 
      </Stack.Navigator>
    </NavigationContainer>
  );
}