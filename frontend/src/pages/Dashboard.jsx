import { useEffect, useState } from "react";
import { apiAskAI } from "../api/ai";
import { apiGetHistory } from "../api/history";
import { useAuth } from "../auth/AuthContext";

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
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Dashboard</h2>
        <div>
          <span style={{ marginRight: 12 }}>{user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Pose ta question..."
        style={{ width: "100%", marginTop: 12 }}
      />

      <button onClick={send} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Envoi..." : "Envoyer"}
      </button>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <h3 style={{ marginTop: 24 }}>Historique</h3>

      {messages.length === 0 && <p>Aucun message.</p>}

      {messages.map((m, idx) => (
        <div
          key={m.id ?? `${m.role}-${idx}`}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            background: m.role === "assistant" ? "#fafafa" : "white",
          }}
        >
          <div style={{ fontWeight: 700 }}>{m.role}</div>
          <div style={{ marginTop: 6 }}>
            {m.content ?? m.text ?? JSON.stringify(m)}
          </div>
        </div>
      ))}
    </div>
  );
}
