'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Sarah Chen',
    email: 'admin@dineflow.com',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    createdAt: new Date('2024-01-01'),
  },
  waiter: {
    id: '2',
    name: 'Marcus Johnson',
    email: 'waiter@dineflow.com',
    role: 'waiter',
    avatar: '/avatars/waiter.jpg',
    createdAt: new Date('2024-02-15'),
  },
  kitchen: {
    id: '3',
    name: 'Chef Antonio',
    email: 'kitchen@dineflow.com',
    role: 'kitchen',
    avatar: '/avatars/kitchen.jpg',
    createdAt: new Date('2024-01-10'),
  },
  cashier: {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'cashier@dineflow.com',
    role: 'cashier',
    avatar: '/avatars/cashier.jpg',
    createdAt: new Date('2024-03-01'),
  },
};

const STORAGE_KEY = 'dineflow_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user by email (mock authentication)
    const foundUser = Object.values(mockUsers).find(u => u.email === email);
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const newUser = mockUsers[role];
    setUser(newUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
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

// Export mock users for dev tools
export { mockUsers };
