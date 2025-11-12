import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';

export type Role = 'admin' | 'instructor' | 'member';
export interface User { id: string; name: string; email: string; role: Role; }

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vc_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      api.setToken(token);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/login', { email, password });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('vc_auth', JSON.stringify(res));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vc_auth');
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
