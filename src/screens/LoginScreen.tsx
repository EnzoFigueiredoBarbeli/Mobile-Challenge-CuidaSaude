import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

type LoginScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavProp;
}

// Credenciais de teste
const MOCK_EMAIL = 'paciente@cuida.com';
const MOCK_PASSWORD = '123456';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export default function LoginScreen({ navigation }: LoginScreenProps): React.ReactElement {
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function validateFields(): boolean {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Por favor, insira seu email');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Por favor, insira um email válido');
      valid = false;
    }

    if (!password) {
      setPasswordError('Por favor, insira sua senha');
      valid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres');
      valid = false;
    }

    return valid;
  }

  async function handleLogin(): Promise<void> {
    if (!validateFields()) return;

    setIsLoading(true);

    // Simula chamada de API
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      const user: UserProfile = { name: 'Paciente', email };
      await login(user);
      navigation.replace('Main');
    } else {
      setIsLoading(false);
      Alert.alert(
        'Erro no Login',
        `Email ou senha incorretos.\n\nUse:\nEmail: ${MOCK_EMAIL}\nSenha: ${MOCK_PASSWORD}`,
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>💙</Text>
          </View>
          <Text style={styles.title}>CuidaSaúde</Text>
          <Text style={styles.subtitle}>Cuidando de você, todos os dias</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : undefined]}
            placeholder="Digite seu email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text: string) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : undefined]}
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
          />
          {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🔐 Credenciais de Teste:</Text>
            <Text style={styles.infoText}>Email: {MOCK_EMAIL}</Text>
            <Text style={styles.infoText}>Senha: {MOCK_PASSWORD}</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    color: '#2C3E50',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0C4F1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#34495E',
    marginTop: 4,
  },
});
