import type { User } from "./auth.types";
import React, { createContext, useState, useEffect } from "react";
import { authApi } from "./auth.api";
import { api } from "../../shared/api/api";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { login: string; password: string }) => Promise<User>;
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
        const response =
        await authApi.me();

        setUser(response.data);
        setToken(savedToken);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (
  data: {
    login: string;
    password: string;
  }
) => {
  const response =
    await authApi.login(data);

  const jwt =
    response.data.accessToken;

  localStorage.setItem(
    "token",
    jwt
  );

  setToken(jwt);

  const payload = JSON.parse(
    atob(jwt.split(".")[1])
  );

  setUser(payload);

  setIsLoading(false);

  return payload;
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
export const useAuth = () => {
  const context =
    React.useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};