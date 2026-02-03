import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Register.css";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await register(email, password);
      nav("/dashboard");
    } catch (e) {
      setErr("Erreur inscription (email deja utilise ?)");
    }
  }

  return (
    <div className="register-wrapper">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <div className="register-container">
        <div className="register-header">
          <div className="register-icon">✨</div>
          <h2>Inscription</h2>
          <p className="register-subtitle">Creez votre compte gratuit</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔑</span>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Creer mon compte</button>
        </form>

        {err && <p className="register-error">{err}</p>}

        <p className="register-link">
          Deja un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
