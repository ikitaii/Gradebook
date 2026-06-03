import type { User } from "./auth.types";
import React, { createContext, useState, useEffect } from "react";
import { authApi } from "./auth.api";
import { api } from "../../shared/api/api";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { login: string; password: string }) => Promise<User>; // <-- ИСПРАВИЛИ ТУТ
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await authApi.me();
        setUser(response.data);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (data: { login: string; password: string }) => { // <-- ИСПРАВИЛИ ТУТ
    const response = await authApi.login(data);
    const jwt = response.data.token;

    localStorage.setItem("token", jwt);
    setToken(jwt);
    
    const meResponse = await authApi.me();
    setUser(meResponse.data);
    return meResponse.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
