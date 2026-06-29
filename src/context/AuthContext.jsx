import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export const DEMO_USER = {
  firstName: "Misbah",
  lastName:  "Samann",
  email:     "admin@userhub.app",
  password:  "admin123",
  role:      "Administrator",
};

const SESSION_KEY = "userhub_auth";

const loadSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(loadSession);
  const [accounts, setAccounts] = useState([DEMO_USER]);

  // Convenience flag — used throughout the app to gate CRUD actions
  const isAdmin = currentUser?.role === "Administrator";

  const login = useCallback((email, password) => {
    const found = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password." };
    const session = { firstName: found.firstName, lastName: found.lastName, email: found.email, role: found.role || "User" };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCurrentUser(session);
    return { success: true };
  }, [accounts]);

  const signup = useCallback((firstName, lastName, email, password) => {
    const exists = accounts.some((a) => a.email.toLowerCase() === email.toLowerCase());
    if (exists) return { success: false, error: "An account with this email already exists." };
    const newAccount = { firstName, lastName, email, password, role: "User" };
    setAccounts((prev) => [...prev, newAccount]);
    const session = { firstName, lastName, email, role: "User" };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCurrentUser(session);
    return { success: true };
  }, [accounts]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);