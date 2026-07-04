import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const createResearch = async (company) => {
  const response = await api.post("/research", {
    company
  });

  return response.data;
};

export default api;