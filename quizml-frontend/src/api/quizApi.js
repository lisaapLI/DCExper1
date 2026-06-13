import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const register     = (payload) => api.post("/auth/register", payload);
export const login        = (payload) => api.post("/auth/login", payload);
export const getProfile   = (nim)     => api.get(`/auth/profile/${nim}`);
export const getHistory   = (nim)     => api.get(`/auth/history/${nim}`);
export const getQuestions = (level)   => {
  const params = level ? { level } : {};
  return api.get("/quiz/questions", { params });
};
export const submitQuiz   = (payload) => api.post("/quiz/submit", payload);

export default api;