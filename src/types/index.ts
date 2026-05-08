// ─── Enums ────────────────────────────────────────────────────────────────────

export enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed',
  NotCompleted = 'not_completed',
}

export enum MoodValue {
  VeryGood = 'muito_bem',
  Good = 'bem',
  Neutral = 'neutro',
  NotGood = 'nao_muito_bem',
  Bad = 'mal',
}

export enum HistoryPeriod {
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Task {
  id: number;
  title: string;
  time: string;
  icon: string;
  description: string;
  status: TaskStatus;
  feedback?: string;
  mood?: MoodValue;
}

export interface HistoryEntry {
  id: string;
  date: string;
  completedTasks: number;
  totalTasks: number;
  mood: string;
  notes: string;
}

export interface UserProfile {
  name: string;
  email: string;
}

export interface UserPreferences {
  shareProgress: boolean;
  shareMood: boolean;
  shareFeedback: boolean;
  notifications: boolean;
}

export interface AuthSession {
  isLoggedIn: boolean;
  user: UserProfile | null;
}

export interface CheckInParams {
  task: Task;
}

// ─── Navigation types ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  CheckIn: CheckInParams;
};

export type MainTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Profile: undefined;
};
