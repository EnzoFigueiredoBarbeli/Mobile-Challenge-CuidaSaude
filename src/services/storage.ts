import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthSession, HistoryEntry, Task, UserPreferences } from '../types';

const KEYS = {
  SESSION: '@cuida_session',
  PREFERENCES: '@cuida_preferences',
  TASKS: '@cuida_tasks',
  HISTORY: '@cuida_history',
} as const;

// ─── Session ──────────────────────────────────────────────────────────────────

export async function saveSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(KEYS.SESSION, JSON.stringify(session));
}

export async function loadSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(KEYS.SESSION);
  if (!raw) return null;
  return JSON.parse(raw) as AuthSession;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.SESSION);
}

// ─── Preferences ──────────────────────────────────────────────────────────────

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  await AsyncStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
}

export async function loadPreferences(): Promise<UserPreferences | null> {
  const raw = await AsyncStorage.getItem(KEYS.PREFERENCES);
  if (!raw) return null;
  return JSON.parse(raw) as UserPreferences;
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
}

export async function loadTasks(): Promise<Task[] | null> {
  const raw = await AsyncStorage.getItem(KEYS.TASKS);
  if (!raw) return null;
  return JSON.parse(raw) as Task[];
}

// ─── History ──────────────────────────────────────────────────────────────────

export async function saveHistory(history: HistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

export async function loadHistory(): Promise<HistoryEntry[] | null> {
  const raw = await AsyncStorage.getItem(KEYS.HISTORY);
  if (!raw) return null;
  return JSON.parse(raw) as HistoryEntry[];
}
