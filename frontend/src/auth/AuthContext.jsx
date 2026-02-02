import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token) setUser({ email: email || "Utilisateur" });
    setReady(true);
  }, []);

  function login(email) {
    localStorage.setItem("token", "test");
    localStorage.setItem("email", email);
    setUser({ email });
  }

  function register(email) {
    login(email);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
