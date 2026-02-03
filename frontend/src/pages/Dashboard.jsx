import { useEffect, useState, useRef } from "react";
import { apiAskAI } from "../api/ai";
import { apiGetHistory, apiDeleteHistory } from "../api/history";
import { useAuth } from "../auth/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function loadHistory() {
    const data = await apiGetHistory();
    setMessages(data.messages || []);
  }

  useEffect(() => {
    loadHistory().catch(() => {});
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function send() {
    if (!text.trim()) return;
    setLoading(true);
    setErr("");
    try {
      await apiAskAI(text);
      setText("");
      await loadHistory();
    } catch (e) {
      setErr("Erreur lors de l'appel IA (token expire ?)");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  async function clearHistory() {
    if (!confirm("Voulez-vous vraiment TOUT effacer ?")) return;
    try {
      await apiDeleteHistory();
      await loadHistory();
    } catch (e) {
      alert("Erreur lors de la suppression de l'historique");
    }
  }

  const getUserInitial = () => {
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="dashboard-wrapper">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="dashboard-container">
        <aside className="sidebar glass-panel">
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">AI Assistant</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-item active">
              <span className="nav-icon">💬</span>
              <span>Conversation</span>
            </button>
            <button className="nav-item" onClick={clearHistory}>
              <span className="nav-icon">🗑️</span>
              <span>Effacer l'historique</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar user-avatar">{getUserInitial()}</div>
              <div className="user-info">
                <span className="user-email">{user?.email}</span>
                <span className="user-status">En ligne</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <span>↪</span>
            </button>
          </div>
        </aside>

        <main className="chat-area">
          <div className="chat-header glass-panel">
            <div className="chat-title">
              <div className="avatar ai-avatar">🤖</div>
              <div>
                <h2>Assistant IA</h2>
                <span className="status-indicator">
                  <span className="status-dot"></span>
                  Pret a repondre
                </span>
              </div>
            </div>
          </div>

          <div className="messages-container glass-panel">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🚀</div>
                <h3>Bienvenue dans votre assistant IA</h3>
                <p>Posez votre premiere question pour commencer la conversation</p>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={m.id ?? `${m.role}-${idx}`}
                className={`message ${m.role}`}
              >
                <div className="avatar">
                  {m.role === "user" ? getUserInitial() : "🤖"}
                </div>
                <div className="message-bubble">
                  <div className="message-content">
                    {m.content ?? m.text ?? JSON.stringify(m)}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="avatar">🤖</div>
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {err && (
            <div className="error-toast glass-panel">
              <span className="error-icon">⚠️</span>
              {err}
            </div>
          )}

          <div className="input-area glass-panel">
            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ecrivez votre message..."
              disabled={loading}
            />
            <button
              className="send-btn"
              onClick={send}
              disabled={loading || !text.trim()}
            >
              <span className="send-icon">➤</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
