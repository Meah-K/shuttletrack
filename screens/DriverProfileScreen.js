import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { mockDriver } from '../src/mockData';
// ^ This imports your mockData.js file.
// Adjust the path if mockData.js is in a different folder.
// '../src/mockData' means: go up one folder, then into src, then find mockData.js
 
export default function DriverProfileScreen({ navigation }) {
 
  const handleLogout = () => {
    // In the real app this would clear the JWT token from storage.
    // For now, just navigate back to Driver Login.
    navigation.replace('DriverLogin');
  };
 
  // Get the first letter of the driver's name for the avatar circle
  const initial = mockDriver.name.charAt(0).toUpperCase();
 
  return (
    <View style={styles.container}>
 
      {/* Avatar circle with the driver's initial */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
 
      <Text style={styles.name}>{mockDriver.name}</Text>
      <Text style={styles.roleLabel}>Shuttle Driver</Text>
 
      {/* Info cards */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>ASSIGNED ROUTE</Text>
        <Text style={styles.cardValue}>{mockDriver.assigned_route}</Text>
      </View>
 
      <View style={styles.card}>
        <Text style={styles.cardLabel}>SHUTTLE ID</Text>
        <Text style={styles.cardValue}>{mockDriver.shuttle_id}</Text>
      </View>
 
      {/* Logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
 
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E8449',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A5276',
    marginBottom: 4,
  },
  roleLabel: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E8E8',
  },
  cardLabel: {
    fontSize: 11,
    color: '#95A5A6',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  logoutBtn: {
    marginTop: 24,
    backgroundColor: '#C0392B',
    paddingVertical: 14,
    paddingHorizontal: 52,
    borderRadius: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});