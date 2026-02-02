import api from "./client";

export async function apiGetHistory() {
  const r = await api.get("/api/history");
  return r.data;
}
