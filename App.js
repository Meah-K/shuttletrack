import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NotificationsScreen from './screens/NotificationsScreen';
import NotificationDetailScreen from './screens/NotificationDetailScreen';
import ErrorScreen from './screens/ErrorScreen';

import { isNetworkError } from './mockData';

const Stack = createStackNavigator();

export default function App() {
  if (isNetworkError) {
    return <ErrorScreen onRetry={() => console.log('Retry pressed')} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}