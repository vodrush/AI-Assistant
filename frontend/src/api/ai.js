import api from "./client";

export async function apiAskAI(text) {
  const r = await api.post("/api/ai/ask", { text });
  return r.data;
}
