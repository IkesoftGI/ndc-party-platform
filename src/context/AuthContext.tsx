// src/context/AuthContext.tsx

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface User {
  name: string;
  role: "executive" | "admin" | "supporter";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean; // ✅ Add this
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);

  const isAuthenticated = !!user; // ✅ dynamic value

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
