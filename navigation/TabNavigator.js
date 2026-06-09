import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import NearbyScreen from '../screens/NearbyScreen';

// Student screens
import HomeMapScreen from '../screens/HomeMapScreen';
import ShuttleDetailScreen from '../screens/ShuttleDetailScreen';
import WalkOrWaitScreen from '../screens/WalkOrWaitScreen';
import RoutesListScreen from '../screens/RoutesListScreen';
import RouteDetailScreen from '../screens/RouteDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import NotificationDetailScreen from '../screens/NotificationDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMap" component={HomeMapScreen} />
      <Stack.Screen name="ShuttleDetail" component={ShuttleDetailScreen} />
      <Stack.Screen name="WalkOrWait" component={WalkOrWaitScreen} />
    </Stack.Navigator>
  );
}

function RoutesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoutesList" component={RoutesListScreen} />
      <Stack.Screen name="RouteDetail" component={RouteDetailScreen} />
      <Stack.Screen name="WalkOrWait" component={WalkOrWaitScreen} />
    </Stack.Navigator>
  );
}

function AlertsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function NearbyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NearbyMain" component={NearbyScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1C6B2A',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#E0E0DC',
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Routes') {
            iconName = focused ? 'bus' : 'bus-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }else if (route.name === 'Nearby') {
  iconName = focused ? 'location' : 'location-outline';
}
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Map" component={MapStack} />
      <Tab.Screen name="Routes" component={RoutesStack} />
      <Tab.Screen name="Alerts" component={AlertsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Nearby" component={NearbyStack} />
    </Tab.Navigator>
  );
}