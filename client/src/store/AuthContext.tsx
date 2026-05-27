import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  meRequest,
  logoutRequest,
} from "../api/auth";

type UserType = {
  id: number;
  fullName: string;
  login: string;
  role: string;
};

type AuthContextType = {
  user: UserType | null;

  isAuth: boolean;

  loading: boolean;

  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<UserType | null>(null);

  const [loading, setLoading] =
    useState(true);

  const checkAuth = async () => {
    try {
      const userData =
        await meRequest();

      setUser(userData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();

      localStorage.removeItem(
        "token"
      );

      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth: !!user,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);