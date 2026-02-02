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
      setErr("Erreur inscription (email déjà utilisé ?)");
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Créer</button>
      </form>

      {err && <p className="register-error">{err}</p>}

      <p className="register-link">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}
