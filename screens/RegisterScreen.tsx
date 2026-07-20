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
  ActivityIndicator,
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { registerStudent } from '../utils/api';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  email?: string;
  password?: string;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps): React.JSX.Element {
  const [name, setName] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!name) newErrors.name = 'Full name is required';
    if (!studentId) newErrors.studentId = 'Student ID is required';
    else if (studentId.length !== 8) newErrors.studentId = 'Student ID must be 8 digits';
    if (!email) newErrors.email = 'Email is required';
    else if (!email.includes('@st.knust.edu.gh')) newErrors.email = 'Use your KNUST student email';
    if (!password) newErrors.password = 'Password is required';
else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';    return newErrors;
  }

  async function handleRegister(): Promise<void> {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await registerStudent({ name, studentId, email, password });
      navigation.navigate('Login');
   } catch (err) {
  console.log('REGISTER ERROR:', err);
  setErrors({ email: 'Registration failed. Please try again.' });
}finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.backRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.backTitle}>Create account</Text>
          </View>

          <View style={styles.progressBg}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.title}>Let's get you set up</Text>
          <Text style={styles.subtitle}>Fill in your details to create your account</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : undefined]}
            placeholder="Your full name"
            placeholderTextColor="#6B7280"
            value={name}
            onChangeText={setName}
          />
          {errors.name ? <Text style={styles.errorText}>⚠ {errors.name}</Text> : null}

          <Text style={styles.label}>Student ID</Text>
          <TextInput
            style={[styles.input, errors.studentId ? styles.inputError : undefined]}
            placeholder="e.g. 21100176"
            placeholderTextColor="#6B7280"
            value={studentId}
            onChangeText={setStudentId}
            keyboardType="numeric"
            maxLength={8}
          />
          {errors.studentId ? <Text style={styles.errorText}>⚠ {errors.studentId}</Text> : null}

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : undefined]}
            placeholder="you@st.knust.edu.gh"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errorText}>⚠ {errors.email}</Text> : null}

          <Text style={styles.label}>Password</Text>
          <View style={[styles.passwordContainer, errors.password ? styles.inputError : undefined]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create a password"
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
          {errors.password ? <Text style={styles.errorText}>⚠ {errors.password}</Text> : null}

          <TouchableOpacity
            style={[styles.registerButton, loading && { backgroundColor: '#6B9E74' }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Create account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log in</Text>
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    marginTop: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0DC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  backTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  progressBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#EAF5EC',
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: {
    width: '25%',
    height: 4,
    backgroundColor: '#1C6B2A',
    borderRadius: 2,
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
    marginBottom: 6,
  },
  inputError: {
    borderColor: '#E63946',
    backgroundColor: '#FFF0F0',
  },
  passwordContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  errorText: {
    fontSize: 12,
    color: '#E63946',
    marginBottom: 12,
  },
  registerButton: {
    backgroundColor: '#1C6B2A',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C6B2A',
  },
});