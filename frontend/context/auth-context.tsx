"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCurrentUser, loginUser, logoutUser } from "@/lib/api/auth.api";

export type UserRole = 'admin' | 'waiter' | 'kitchen' | 'cashier';

export interface AuthData {
  id: string;
  name: string;
  email: string;
  token: string;
  role: UserRole;
}
interface AuthContextType {
  user: AuthData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthData | null>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth-data";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const token = localStorage.getItem(TOKEN_KEY);

        if (stored && token) {
          const parsed = JSON.parse(stored);

          setUser(parsed as unknown as AuthData);
        } else {
          const response = await getCurrentUser();

          if (response.success && response.user) {
            const userData = {
              ...response.user,
              id: response.user.id || response.user._id,
            } as unknown as AuthData;

            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthData | null> => {
      setIsLoading(true);

      try {
        const response = await loginUser(email, password);

        if (response.success) {
          const backendUser = response.user;
          const token = response.token;

          const structuredUser: AuthData = {
            id: backendUser._id || backendUser.id,
            name: backendUser.name,
            email: backendUser.email,
            token,
            role: backendUser.role,
          };

          setUser(structuredUser as unknown as AuthData);

          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(structuredUser));

          return structuredUser as unknown as AuthData;
        }

        return null;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await logoutUser();
    } catch {
      // ignore
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setIsLoading(false);
    }
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser((current) =>
      current
        ? {
            ...current,
            role,
          }
        : null,
    );
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
