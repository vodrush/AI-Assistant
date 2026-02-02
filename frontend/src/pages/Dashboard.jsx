import { useEffect, useState } from "react";
import { apiAskAI } from "../api/ai";
import { apiGetHistory } from "../api/history";
import { useAuth } from "../auth/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loadHistory() {
    const data = await apiGetHistory();
    setMessages(data.messages || []);
  }

  useEffect(() => {
    loadHistory().catch(() => {});
  }, []);

  async function send() {
    if (!text.trim()) return;
    setLoading(true);
    setErr("");
    try {
      await apiAskAI(text);
      setText("");
      await loadHistory();
    } catch (e) {
      setErr("Erreur lors de l’appel IA (token expiré ?)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-user">
          <span>{user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-input">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pose ta question..."
        />
        <button onClick={send} disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </div>

      {err && <p className="dashboard-error">{err}</p>}

      <div className="dashboard-history">
        <h3>Historique</h3>

        {messages.length === 0 && <p className="dashboard-empty">Aucun message.</p>}

        {messages.map((m, idx) => (
          <div
            key={m.id ?? `${m.role}-${idx}`}
            className={`message-card ${m.role}`}
          >
            <div className="message-role">{m.role}</div>
            <div className="message-content">
              {m.content ?? m.text ?? JSON.stringify(m)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
