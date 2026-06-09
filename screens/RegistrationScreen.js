import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
 
export default function RegistrationScreen({ navigation }) {
 
  // useState stores what the user types in each field
  const [name,      setName]      = useState('');
  const [studentId, setStudentId] = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
 
  const handleRegister = () => {
 
    // ── VALIDATION ──────────────────────────────────────────────
    if (!name.trim()) {
      Alert.alert('Missing Field', 'Please enter your full name.');
      return; // stop here — don't continue
    }
    if (!studentId.trim()) {
      Alert.alert('Missing Field', 'Please enter your student ID.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Missing Field', 'Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address. It must contain @.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Missing Field', 'Please enter a password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Your password must be at least 6 characters long.');
      return;
    }
 
    // ── MOCK REGISTRATION (no real API yet) ─────────────────────
    // If all validation passed, go straight to Home
    navigation.replace('Home');
  };
 
  return (
    // KeyboardAvoidingView pushes the form up when the keyboard appears
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
 
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>
          Register with your KNUST student email
        </Text>
 
        {/* ── FULL NAME ── */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Abena Owusu"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
 
        {/* ── STUDENT ID ── */}
        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 21090001"
          value={studentId}
          onChangeText={setStudentId}
          keyboardType="numeric"
        />
 
        {/* ── EMAIL ── */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="yourname@st.knust.edu.gh"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
 
        {/* ── PASSWORD ── */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Minimum 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}  // hides the password characters
        />
 
        {/* ── REGISTER BUTTON ── */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
 
        {/* ── LINK TO LOGIN ── */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            Already have an account?  Log In
          </Text>
        </TouchableOpacity>
 
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A5276',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#FDFEFE',
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#1E8449',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    textAlign: 'center',
    color: '#2980B9',
    fontSize: 15,
    marginTop: 6,
  },
});