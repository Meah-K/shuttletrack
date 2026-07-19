import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  DriverLogin: undefined;
  DriverStatus: undefined;
  Login: undefined;
};

type DriverLoginNavigationProp = StackNavigationProp<RootStackParamList, 'DriverLogin'>;

interface DriverLoginScreenProps {
  navigation: DriverLoginNavigationProp;
}

export default function DriverLoginScreen({ navigation }: DriverLoginScreenProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  function handleLogin(): void {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    navigation.replace('DriverStatus');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
            <Text style={styles.backText}>Back to login</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="bus" size={20} color="#1C6B2A" />
            </View>
            <Text style={styles.logoText}>ShuttleTrack</Text>
          </View>

          <Text style={styles.title}>Driver login</Text>
          <Text style={styles.subtitle}>Sign in to start sharing your location</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="driver@knust.edu.gh"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log in as driver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.studentRow} onPress={() => navigation.goBack()}>
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text style={styles.studentText}>I'm a student</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F5' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 32, marginTop: 10 },
  backText: { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
  logoIcon: { width: 36, height: 36, backgroundColor: '#EAF5EC', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 16, fontWeight: '700', color: '#1C6B2A' },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6B7280', marginBottom: 32 },
  label: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 12, padding: 14, fontSize: 15, color: '#1A1A1A', marginBottom: 16 },
  passwordContainer: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#1C6B2A', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  passwordInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  showText: { fontSize: 13, fontWeight: '600', color: '#1C6B2A' },
  errorText: { fontSize: 13, color: '#E63946', marginBottom: 12, textAlign: 'center' },
  loginButton: { backgroundColor: '#1C6B2A', borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 24 },
  loginButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  studentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 32 },
  studentText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
});