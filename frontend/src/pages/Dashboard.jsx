import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadHistory() {
    const r = await api.get("/history?limit=50");
    setHistory(r.data);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function send() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.post("/chat", { message: text });
      setText("");
      await loadHistory();
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
        placeholder="Écris ton message à l'IA..."
        style={{ width: "100%", marginTop: 12 }}
      />
      <button onClick={send} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Envoi..." : "Envoyer"}
      </button>

      <h3 style={{ marginTop: 24 }}>Historique</h3>
      <div>
        {history.map((h) => (
          <div
            key={h.id}
            style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}
          >
            <div>
              <strong>Prompt:</strong> {h.prompt}
            </div>
            <div style={{ marginTop: 6 }}>
              <strong>Réponse:</strong> {h.response}
            </div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
              {h.created_at} — {h.model}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
