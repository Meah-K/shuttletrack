import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { authApi } from '../../lib/api';
import { saveSession } from '../../lib/tokenStorage';
import { colors, radius, spacing, typography } from '../../theme/colors';

interface Props {
  navigation: { replace: (screen: string) => void };
}

export default function DriverLoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password');
      return;
    }

    if (!email.endsWith('@knust.edu.gh')) {
      setError('Please use your KNUST email address');
      return;
    }

    setLoading(true);
    try {
      // 🔴 REAL API CALL — replaces the old mock token
      const response = await authApi.driverLogin(email.trim(), password);
      const { token, role } = response.data;

      // Save the real JWT token and role to secure storage
      await saveSession(token, role);

      // Navigate to the Driver Status screen
      navigation.replace('DriverStatus');

    } catch (e: any) {
      // Handle specific error responses from the backend
      const status = e?.response?.status;

      if (status === 401) {
        setError('Wrong email or password. Please try again.');
      } else if (status === 403) {
        setError('This account is not registered as a driver.');
      } else if (status === 0 || !e?.response) {
        setError('Cannot reach the server. Check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>🚌</Text>
          </View>
          <Text style={styles.brandText}>ShuttleTrack</Text>
        </View>

        <Text style={styles.heading}>Welcome back 👋</Text>
        <Text style={styles.subheading}>Log in to start your route</Text>

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={[styles.input, emailFocused && styles.inputFocused, error && styles.inputError]}
          placeholder="driver@knust.edu.gh"
          placeholderTextColor={colors.textPlaceholder}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />

        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.passwordRow,
            passwordFocused && styles.inputFocused,
            error && styles.inputError,
          ]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            placeholderTextColor={colors.textPlaceholder}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.showButton}>
            <Text style={styles.showButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in…' : 'Log in'}</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Need access? Contact the transport office.</Text>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  logoBox: {
    width: 32, height: 32, borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  logoEmoji: { fontSize: 18 },
  brandText: { ...typography.button, color: colors.primary },
  heading: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  label: { ...typography.label, color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.md },
  input: {
    ...typography.body,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    color: colors.textPrimary,
  },
  inputFocused: { borderColor: colors.borderFocus },
  inputError: { borderColor: colors.borderError, backgroundColor: '#FFF5F5' },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md,
  },
  passwordInput: {
    ...typography.body,
    flex: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    color: colors.textPrimary,
  },
  showButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  showButtonText: { ...typography.bodyBold, color: colors.primary },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.sm },
  button: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.xl,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { ...typography.button, color: colors.textOnPrimary },
  hint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
