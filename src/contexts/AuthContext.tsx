'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithCustomToken, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAdminUser } from '@/actions/auth';
import type { AdminUser } from '@/types';

interface AuthContextType {
  user: User | null;
  adminData: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        const data = await getAdminUser(firebaseUser.email);
        setAdminData(data as AdminUser | null);
      } else {
        setAdminData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithToken = async (token: string) => {
    const cred = await signInWithCustomToken(auth, token);
    if (cred.user?.email) {
      const data = await getAdminUser(cred.user.email);
      setAdminData(data as AdminUser | null);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setAdminData(null);
  };

  return (
    <AuthContext.Provider value={{ user, adminData, loading, logout, signInWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
