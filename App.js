import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RoutesScreen from './screens/RoutesScreen';
import RouteDetailScreen from './screens/RouteDetailScreen';
import WalkOrWaitScreen from './screens/WalkOrWaitScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Routes">
        <Stack.Screen
          name="Routes"
          component={RoutesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RouteDetail"
          component={RouteDetailScreen}
          options={{ title: 'Route Detail' }}
        />
        <Stack.Screen
          name="WalkOrWait"
          component={WalkOrWaitScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}