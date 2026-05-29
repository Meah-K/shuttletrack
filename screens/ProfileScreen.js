import React from 'react';
import {
  View, Text, StyleSheet,
  SafeAreaView, TouchableOpacity
} from 'react-native';
import { currentStudent } from '../mockData';

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    alert('Logged out!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>👤 My Profile</Text>

      <View style={styles.avatarBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentStudent.name.charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>{currentStudent.name}</Text>
        <Text style={styles.role}>{currentStudent.role}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Student ID</Text>
          <Text style={styles.rowValue}>{currentStudent.studentId}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Email</Text>
          <Text style={styles.rowValue}>{currentStudent.email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>User ID</Text>
          <Text style={styles.rowValue}>{currentStudent.userId}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 22, fontWeight: 'bold',
    padding: 20, backgroundColor: '#1C6B2A', color: 'white'
  },
  avatarBox: { alignItems: 'center', paddingVertical: 30 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#1C6B2A', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 36, color: 'white', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  role: { fontSize: 13, color: '#888', marginTop: 4 },
  card: {
    backgroundColor: 'white', marginHorizontal: 16,
    borderRadius: 12, elevation: 2, padding: 8,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 14,
  },
  rowLabel: { fontSize: 14, color: '#888' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 14 },
  logoutBtn: {
    margin: 16, backgroundColor: '#D32F2F',
    padding: 16, borderRadius: 12, alignItems: 'center',
  },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});