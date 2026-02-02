import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/auth/register", { email, password });
      await login(email, password);
      nav("/dashboard");
    } catch {
      setErr("Impossible de créer le compte (email déjà utilisé ?)");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          placeholder="Password (8+)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button type="submit">Créer le compte</button>
      </form>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <p>
        Déjà un compte ? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
