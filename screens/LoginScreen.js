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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleLogin() {
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Mock login — no real API yet
    // Any email and password works for now
    setError('');
    navigation.navigate('Main');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Logo row */}
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>🚌</Text>
            </View>
            <Text style={styles.logoText}>ShuttleTrack</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome back 👋</Text>
          <Text style={styles.subtitle}>Log in to track your shuttle</Text>

          {/* Email field */}
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@st.knust.edu.gh"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password field */}
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
              <Text style={styles.showText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Error message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Login button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google button */}
          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
    marginTop: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#EAF5EC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    fontSize: 18,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C6B2A',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  passwordContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1C6B2A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  showText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C6B2A',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C6B2A',
  },
  errorText: {
    fontSize: 13,
    color: '#E63946',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#1C6B2A',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C6B2A',
  },
});