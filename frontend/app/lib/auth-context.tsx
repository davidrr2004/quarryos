"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { api } from "./api";

type UserData = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
};

type AuthState = {
  user: UserData | null;
  loading: boolean;
};

let authState: AuthState = { user: null, loading: true };
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function setAuthState(next: Partial<AuthState>) {
  authState = { ...authState, ...next };
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return authState;
}

let initialized = false;

function initAuth() {
  if (initialized) return;
  initialized = true;

  const token = api.getToken();
  if (!token) {
    setAuthState({ loading: false });
    return;
  }

  api
    .me()
    .then((res) => {
      setAuthState({ user: res.data as UserData, loading: false });
    })
    .catch(() => {
      api.clearToken();
      setAuthState({ loading: false });
    });
}

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (!ready) {
    initAuth();
    setReady(true);
  }

  const login = useCallback(async (email: string, password: string) => {
    await api.login(email, password);
    const res = await api.me();
    setAuthState({ user: res.data as UserData, loading: false });
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, loading: false });
    api.logout();
  }, []);

  return (
    <AuthContext value={{ user: state.user, loading: state.loading, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
