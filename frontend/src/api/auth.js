import api from "./client";

export async function apiRegister(email, password) {
  const r = await api.post("/api/auth/register", { email, password });
  return r.data;
}

export async function apiLogin(email, password) {
  const r = await api.post("/api/auth/login", { email, password });
  return r.data;
}
