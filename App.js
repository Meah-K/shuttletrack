<<<<<<< HEAD
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeMapScreen from './screens/HomeMapScreen';
import ShuttleDetailScreen from './screens/ShuttleDetailScreen';
import WalkOrWaitScreen from './screens/WalkOrWaitScreen';
=======
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NotificationsScreen from './screens/NotificationsScreen';
import NotificationDetailScreen from './screens/NotificationDetailScreen';
import ErrorScreen from './screens/ErrorScreen';

import { isNetworkError } from './mockData';
>>>>>>> origin/feature/notifications-marvelle

const Stack = createStackNavigator();

export default function App() {
<<<<<<< HEAD
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={HomeMapScreen} />
        <Stack.Screen name="ShuttleDetail" component={ShuttleDetailScreen} />
        <Stack.Screen name="WalkOrWait" component={WalkOrWaitScreen} />
=======
  if (isNetworkError) {
    return <ErrorScreen onRetry={() => console.log('Retry pressed')} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
>>>>>>> origin/feature/notifications-marvelle
      </Stack.Navigator>
    </NavigationContainer>
  );
}