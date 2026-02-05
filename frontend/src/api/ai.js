import api from "./client";

export async function apiAskAI(text) {
  const response = await api.post("/api/ai/ask", { text });
  return response.data;
}
