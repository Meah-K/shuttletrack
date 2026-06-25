import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeMapScreen from '../screens/HomeMapScreen';
import ShuttleDetailScreen from '../screens/ShuttleDetailScreen';
import WalkOrWaitScreen from '../screens/WalkOrWaitScreen';
import RoutesListScreen from '../screens/RoutesListScreen';
import RouteDetailScreen from '../screens/RouteDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import NotificationDetailScreen from '../screens/NotificationDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NearbyScreen from '../screens/NearbyScreen';
import type { Shuttle, Route, AppNotification } from '../mockData';

type MapStackParamList = {
  HomeMap: undefined;
  ShuttleDetail: { shuttle: Shuttle };
  WalkOrWait: { shuttle: Shuttle };
};

type RoutesStackParamList = {
  RoutesList: undefined;
  RouteDetail: { route: Route; shuttle: Shuttle | undefined };
  WalkOrWait: { shuttle: Shuttle };
};

type AlertsStackParamList = {
  Notifications: undefined;
  NotificationDetail: { notification: AppNotification };
};

type ProfileStackParamList = {
  ProfileMain: undefined;
};

type NearbyStackParamList = {
  NearbyMain: undefined;
};

const Tab = createBottomTabNavigator();
const MapNav = createStackNavigator<MapStackParamList>();
const RoutesNav = createStackNavigator<RoutesStackParamList>();
const AlertsNav = createStackNavigator<AlertsStackParamList>();
const ProfileNav = createStackNavigator<ProfileStackParamList>();
const NearbyNav = createStackNavigator<NearbyStackParamList>();

function MapStack(): React.JSX.Element {
  return (
    <MapNav.Navigator screenOptions={{ headerShown: false }}>
      <MapNav.Screen name="HomeMap" component={HomeMapScreen} />
      <MapNav.Screen name="ShuttleDetail" component={ShuttleDetailScreen} />
      <MapNav.Screen name="WalkOrWait" component={WalkOrWaitScreen} />
    </MapNav.Navigator>
  );
}

function RoutesStack(): React.JSX.Element {
  return (
    <RoutesNav.Navigator screenOptions={{ headerShown: false }}>
      <RoutesNav.Screen name="RoutesList" component={RoutesListScreen} />
      <RoutesNav.Screen name="RouteDetail" component={RouteDetailScreen} />
      <RoutesNav.Screen name="WalkOrWait" component={WalkOrWaitScreen} />
    </RoutesNav.Navigator>
  );
}

function AlertsStack(): React.JSX.Element {
  return (
    <AlertsNav.Navigator screenOptions={{ headerShown: false }}>
      <AlertsNav.Screen name="Notifications" component={NotificationsScreen} />
      <AlertsNav.Screen name="NotificationDetail" component={NotificationDetailScreen} />
    </AlertsNav.Navigator>
  );
}

function ProfileStack(): React.JSX.Element {
  return (
    <ProfileNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileNav.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileNav.Navigator>
  );
}

function NearbyStack(): React.JSX.Element {
  return (
    <NearbyNav.Navigator screenOptions={{ headerShown: false }}>
      <NearbyNav.Screen name="NearbyMain" component={NearbyScreen} />
    </NearbyNav.Navigator>
  );
}

export default function TabNavigator(): React.JSX.Element {
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
          height: 88,
          paddingBottom: 30,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
          let iconName: string = 'map-outline';
          if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Routes') iconName = focused ? 'bus' : 'bus-outline';
          else if (route.name === 'Alerts') iconName = focused ? 'notifications' : 'notifications-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Nearby') iconName = focused ? 'location' : 'location-outline';
          return <Ionicons name={iconName as any} size={24} color={color} />;
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