import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiRegister } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token) setUser({ email: email || "Utilisateur" });
    else setUser(null);
    setReady(true);
  }, []);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("email", email);
    setUser({ email });
  }

  async function register(email, password) {
    await apiRegister(email, password);
    await login(email, password);
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
