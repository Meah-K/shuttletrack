import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Switch,
} from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  // Student user data - replace with actual data from mockData.js later
  const userData = {
    name: 'Shila Boateng',
    email: 'shila.b@shuttletrack.com',
    studentId: 'STU-2024-1234',
    role: 'Student',
    joinDate: 'January 2025',
    profileImage: null, // will use placeholder
  };

  const menuItems = [
    { icon: '🚗', title: 'My Trips', subtitle: 'View trip history' },
    { icon: '⭐', title: 'Saved Routes', subtitle: 'Your favorite routes' },
    { icon: '🔔', title: 'Notifications', subtitle: 'Manage alerts', hasSwitch: true, value: notificationsEnabled, setValue: setNotificationsEnabled },
    { icon: '🌙', title: 'Dark Mode', subtitle: 'Change theme', hasSwitch: true, value: darkMode, setValue: setDarkMode },
    { icon: '❓', title: 'Help Center', subtitle: 'FAQs and support' },
    { icon: '📜', title: 'Terms & Privacy', subtitle: 'Legal information' },
    { icon: '🚪', title: 'Log Out', subtitle: 'Sign out of your account', isDanger: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image and Name */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImagePlaceholder}>👤</Text>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userRole}>{userData.role}</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student ID</Text>
            <Text style={styles.infoValue}>{userData.studentId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member since</Text>
            <Text style={styles.infoValue}>{userData.joinDate}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => {
                if (item.title === 'Log Out') {
                  // Handle logout - navigate to login screen
                  navigation.navigate('Login');
                }
              }}
            >
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, item.isDanger && styles.dangerText]}>
                  {item.title}
                </Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              {item.hasSwitch ? (
                <Switch
                  value={item.value}
                  onValueChange={item.setValue}
                  trackColor={{ false: '#d0d0d0', true: '#007AFF' }}
                  thumbColor="#fff"
                />
              ) : (
                <Text style={styles.menuArrow}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backArrow: {
    fontSize: 28,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    fontSize: 48,
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  userRole: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  dangerText: {
    color: '#F44336',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 30,
  },
});