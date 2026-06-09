import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { currentStudent } from '../mockData';

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  function handleLogout() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const menuItems = [
  {
    icon: 'notifications-outline',
    title: 'Push notifications',
    subtitle: 'Manage alerts',
    hasSwitch: true,
    value: notificationsEnabled,
    setValue: setNotificationsEnabled,
  },
  {
    icon: 'information-circle-outline',
    title: 'About ShuttleTrack',
    subtitle: 'Version 1.0.0',
  },
  {
    icon: 'document-text-outline',
    title: 'Terms & Privacy',
    subtitle: 'Legal information',
  },

  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentStudent.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.name}>{currentStudent.name}</Text>
          <Text style={styles.role}>Student</Text>
        </View>

        {/* Info card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full name</Text>
            <Text style={styles.infoValue}>{currentStudent.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student ID</Text>
            <Text style={styles.infoValue}>{currentStudent.studentId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{currentStudent.email}</Text>
          </View>
        </View>

        {/* Settings card */}
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <View style={styles.menuItem}>
                <View style={styles.menuIconBox}>
<Ionicons name={item.icon} size={20} color="#1C6B2A" />                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                {item.hasSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.setValue}
                    trackColor={{ false: '#D0D0CC', true: '#1C6B2A' }}
                    thumbColor="#FFFFFF"
                  />
                ) : (
                  <Text style={styles.chevron}>›</Text>
                )}
              </View>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  titleRow: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF5EC',
    borderWidth: 2,
    borderColor: '#1C6B2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C6B2A',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#E0E0DC',
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  infoRow: {
    padding: 14,
    gap: 3,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#F0F0EC',
    marginLeft: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F7F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 18,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  chevron: {
    fontSize: 22,
    color: '#D0D0CC',
  },
  logoutButton: {
    backgroundColor: '#FFF0F0',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E63946',
  },
});