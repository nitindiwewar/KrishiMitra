/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserSession, UserRecord } from '../services/authService';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginUser: (mobile: string, password?: string) => Promise<UserSession>;
  loginAdmin: (email?: string, password?: string) => Promise<UserSession>;
  registerUser: (user: Omit<UserRecord, 'id' | 'role'>) => Promise<UserRecord>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize with storage on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setLoading(true);
    try {
      const activeUser = authService.getCurrentUser();
      setUser(activeUser);
    } catch (err) {
      console.error('Failed to parse active user session', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (mobile: string, password?: string): Promise<UserSession> => {
    setLoading(true);
    try {
      const session = await authService.loginUser(mobile, password);
      setUser(session);
      return session;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email?: string, password?: string): Promise<UserSession> => {
    setLoading(true);
    try {
      const session = await authService.loginAdmin(email, password);
      setUser(session);
      return session;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (newUser: Omit<UserRecord, 'id' | 'role'>): Promise<UserRecord> => {
    setLoading(true);
    try {
      const record = await authService.registerUser(newUser);
      return record;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        loginUser,
        loginAdmin,
        registerUser,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
