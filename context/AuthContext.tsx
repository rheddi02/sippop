import { User } from "@/utils/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Skip login for now - automatically set a logged-in user
  const [user, setUser] = useState<User | null>({
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    points: 5,
    walletBalance: 200,
  });

  const login = (email: string, password: string) => {
    // mock login
    setUser({
      id: "u1",
      name: "John Doe",
      email,
      points: 5,
      walletBalance: 200,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}