import api from "./client";

export async function apiGetHistory() {
  const response = await api.get("/api/history");
  return response.data;
}

export async function apiDeleteHistory() {
  const response = await api.delete("/api/history");
  return response.data;
}
