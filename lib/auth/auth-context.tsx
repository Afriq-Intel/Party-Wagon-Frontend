"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AuthApiError,
  loginWithEmailPassword,
  logoutRemote,
  resolveAuthenticatedUser,
} from "@/lib/auth/api";
import { isOperationsRole } from "@/lib/auth/roles";
import {
  clearTokens,
  persistTokens,
  setOpsSessionCookie,
  subscribeToAuthChanges,
} from "@/lib/auth/session";
import type { AuthUser } from "@/lib/auth/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  isOperationsUser: boolean;
  login: (
    email: string,
    password: string,
    options?: { remember?: boolean },
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function syncOpsSessionCookie(user: AuthUser | null) {
  setOpsSessionCookie(isOperationsRole(user?.role));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshUser = useCallback(async () => {
    try {
      const next = await resolveAuthenticatedUser();
      setUser(next);
      setStatus(next ? "authenticated" : "unauthenticated");
      syncOpsSessionCookie(next);
    } catch {
      clearTokens();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void refreshUser();
    return subscribeToAuthChanges(() => {
      void refreshUser();
    });
  }, [refreshUser]);

  const login = useCallback(async (
    email: string,
    password: string,
    options?: { remember?: boolean },
  ) => {
    const tokens = await loginWithEmailPassword(email, password);
    persistTokens(tokens, options?.remember ?? true);

    let nextUser: AuthUser;
    try {
      nextUser = (await resolveAuthenticatedUser()) as AuthUser;
    } catch (error) {
      clearTokens();
      throw error;
    }

    if (!nextUser) {
      clearTokens();
      throw new AuthApiError("Unable to load authenticated user", 401);
    }

    syncOpsSessionCookie(nextUser);
    setUser(nextUser);
    setStatus("authenticated");
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRemote();
    } catch {
      clearTokens();
    }
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isOperationsUser: isOperationsRole(user?.role),
      login,
      logout,
      refreshUser,
    }),
    [user, status, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
