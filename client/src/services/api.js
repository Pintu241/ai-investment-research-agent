import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const createResearch = async (company) => {
  const response = await api.post("/research", {
    company
  });

  return response.data;
};

export default api;