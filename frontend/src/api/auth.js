import api from "./client";

export async function apiRegister(email, password) {
  const r = await api.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
    email,
    password,
  });
  return r.data;
}

export async function apiLogin(email, password) {
  const r = await api.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
    email,
    password,
  });
  return r.data;
}
