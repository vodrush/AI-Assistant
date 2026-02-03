import api from "./client";

export async function apiGetHistory() {
  const r = await api.get("/api/history");
  return r.data;
}

export async function apiDeleteHistory() {
  const r = await api.delete("/api/history");
  return r.data;
}
