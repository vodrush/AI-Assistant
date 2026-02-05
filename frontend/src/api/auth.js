import api from "./client";

export async function apiRegister(email, password) {
  const response = await api.post("/api/auth/register", { email, password });
  return response.data;
}

export async function apiLogin(email, password) {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
}
