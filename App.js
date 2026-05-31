/**
 * TEMPORARY test App.js — for Salma to see her own work running.
 *
 * This file is NOT for the final commit. Mirabelle is writing the real
 * App.tsx that routes between Student and Driver apps. This one just
 * opens straight to your Driver Login screen so you can test your
 * work in isolation.
 *
 * What to do with this file:
 *   1. Open the existing App.js in your shuttletrack repo
 *   2. Select all (Ctrl+A) and delete the existing contents
 *   3. Paste this entire file in
 *   4. Save (Ctrl+S)
 *   5. Run `npx expo start --tunnel` and scan with Expo Go
 *
 * Don't commit this file to your branch. It's just for local testing.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DriverLoginScreen from './src/screens/driver/DriverLoginScreen';
import DriverStatusScreen from './src/screens/driver/DriverStatusScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DriverLogin"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
        <Stack.Screen name="DriverStatus" component={DriverStatusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}