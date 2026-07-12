import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Inject Authorization header on outgoing requests if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const signupUser = async (details) => {
  const response = await api.post("/auth/signup", details);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const createResearch = async (company) => {
  const response = await api.post("/research", {
    company
  });

  return response.data;
};

export const getResearchHistory = async () => {
  const response = await api.get("/research");
  return response.data;
};

export const getResearchById = async (id) => {
  const response = await api.get(`/research/${id}`);
  return response.data;
};

export const deleteResearch = async (id) => {
  const response = await api.delete(`/research/${id}`);
  return response.data;
};

export const toggleSaveResearch = async (id) => {
  const response = await api.patch(`/research/${id}/toggle-save`);
  return response.data;
};

export default api;