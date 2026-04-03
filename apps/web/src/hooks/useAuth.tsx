import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { api } from '@/lib/api';
import type { UserProfile } from '@cinema-app/shared';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setState({ user: null, loading: false, isAuthenticated: false });
      return;
    }

    try {
      const user = await api.get<UserProfile>('/auth/me');
      setState({ user, loading: false, isAuthenticated: true });
    } catch {
      setState({ user: null, loading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = () => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setState({ user: null, loading: false, isAuthenticated: false });
    window.location.href = '/login';
  };

  return (
    <AuthContext value={{
      ...state,
      login,
      logout,
      refreshUser: fetchUser,
    }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
