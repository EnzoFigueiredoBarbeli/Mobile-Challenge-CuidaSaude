import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, UserPreferences } from '../types';
import { useAuth } from '../context/AuthContext';
import { loadPreferences, savePreferences } from '../services/storage';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

interface ProfileScreenProps {
  navigation: ProfileNavProp;
}

const DEFAULT_PREFS: UserPreferences = {
  shareProgress: true,
  shareMood: true,
  shareFeedback: false,
  notifications: true,
};

export default function ProfileScreen({ navigation }: ProfileScreenProps): React.ReactElement {
  const { session, logout } = useAuth();

  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Carrega preferências persistidas
  useEffect(() => {
    async function fetchPrefs(): Promise<void> {
      try {
        const saved = await loadPreferences();
        if (saved) setPrefs(saved);
      } catch (error) {
        console.warn('Erro ao carregar preferências:', error);
      } finally {
        setIsLoadingPrefs(false);
      }
    }
    fetchPrefs();
  }, []);

  function updatePref<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
    setPrefs((prev: UserPreferences) => ({ ...prev, [key]: value }));
  }

  async function handleSave(): Promise<void> {
    setIsSaving(true);
    try {
      await savePreferences(prefs);
      Alert.alert('✅ Configurações Salvas', 'Suas preferências foram atualizadas!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout(): void {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  }

  if (isLoadingPrefs) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho do perfil */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={styles.name}>{session.user?.name ?? 'Paciente'}</Text>
        <Text style={styles.email}>{session.user?.email ?? ''}</Text>
      </View>

      {/* Privacidade */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacidade e Compartilhamento</Text>
        <Text style={styles.sectionDesc}>
          Escolha quais informações deseja compartilhar com sua equipe médica
        </Text>

        <SettingRow
          icon="📊"
          title="Progresso das Tarefas"
          description="Compartilhar conclusão de tarefas diárias"
          value={prefs.shareProgress}
          onChange={(v) => updatePref('shareProgress', v)}
        />
        <SettingRow
          icon="😊"
          title="Estado de Humor"
          description="Compartilhar como você está se sentindo"
          value={prefs.shareMood}
          onChange={(v) => updatePref('shareMood', v)}
        />
        <SettingRow
          icon="💬"
          title="Feedbacks Detalhados"
          description="Compartilhar comentários sobre dificuldades"
          value={prefs.shareFeedback}
          onChange={(v) => updatePref('shareFeedback', v)}
          isLast
        />
      </View>

      {/* Notificações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <SettingRow
          icon="🔔"
          title="Lembretes de Tarefas"
          description="Receber notificações nos horários das tarefas"
          value={prefs.notifications}
          onChange={(v) => updatePref('notifications', v)}
          isLast
        />
      </View>

      {/* Informações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        {INFO_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.infoRow, idx === INFO_ITEMS.length - 1 && styles.rowLast]}
            activeOpacity={0.6}
          >
            <Text style={styles.infoIcon}>{item.icon}</Text>
            <Text style={styles.infoLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botões */}
      <TouchableOpacity
        style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={isSaving}
        activeOpacity={0.8}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveBtnText}>Salvar Configurações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutBtnText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

// ─── Sub-componente interno ───────────────────────────────────────────────────

interface SettingRowProps {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  isLast?: boolean;
}

function SettingRow({ icon, title, description, value, onChange, isLast }: SettingRowProps): React.ReactElement {
  return (
    <View style={[styles.settingRow, isLast && styles.rowLast]}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>
          {icon} {title}
        </Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#D0D0D0', true: '#4A90E2' }}
        thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
      />
    </View>
  );
}

const INFO_ITEMS = [
  { icon: 'ℹ️', label: 'Sobre o CuidaSaúde' },
  { icon: '📋', label: 'Termos de Uso' },
  { icon: '🔒', label: 'Política de Privacidade' },
  { icon: '📞', label: 'Suporte' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#E8F4F8',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#2C3E50',
  },
  saveBtn: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 56,
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnDisabled: {
    backgroundColor: '#A0C4F1',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  logoutBtnText: {
    color: '#E74C3C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 32,
  },
});
