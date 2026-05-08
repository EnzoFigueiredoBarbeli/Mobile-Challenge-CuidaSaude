import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { AuthSession, UserProfile } from '../types';
import { clearSession, loadSession, saveSession } from '../services/storage';

interface AuthContextData {
  session: AuthSession;
  isLoading: boolean;
  login: (user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: PropsWithChildren): React.ReactElement {
  const [session, setSession] = useState<AuthSession>({
    isLoggedIn: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carrega sessão salva ao abrir o app
  useEffect(() => {
    async function restoreSession(): Promise<void> {
      try {
        const saved = await loadSession();
        if (saved?.isLoggedIn && saved.user) {
          setSession(saved);
        }
      } catch (error) {
        console.warn('Erro ao restaurar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(user: UserProfile): Promise<void> {
    const newSession: AuthSession = { isLoggedIn: true, user };
    setSession(newSession);
    await saveSession(newSession);
  }

  async function logout(): Promise<void> {
    setSession({ isLoggedIn: false, user: null });
    await clearSession();
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
