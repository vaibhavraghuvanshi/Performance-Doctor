import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearSession,
  fetchCurrentUser,
} from "../services/authApi";
import { getStoredAuthToken } from "../services/apiBase";
import type { AuthUser } from "../services/authApi";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  /** Call after login/register once token is in `localStorage`. */
  setAuthenticatedUser: (user: AuthUser) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredAuthToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const t = getStoredAuthToken();
    setToken(t);
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const u = await fetchCurrentUser();
      setUser(u);
    } catch (e) {
      setUser(null);
      setError(e instanceof Error ? e.message : "Session expired");
      clearSession();
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const setAuthenticatedUser = useCallback((u: AuthUser) => {
    setUser(u);
    setToken(getStoredAuthToken());
    setError(null);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      error,
      setAuthenticatedUser,
      refreshUser,
      logout,
    }),
    [token, user, loading, error, setAuthenticatedUser, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
