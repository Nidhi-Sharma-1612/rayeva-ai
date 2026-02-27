import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const categorizeProduct = async (productData) => {
  const response = await axios.post(`${API_URL}/categorizer`, productData);
  return response.data;
};

export const getCategoryHistory = async (limit = 50) => {
  const response = await axios.get(`${API_URL}/categorizer?limit=${limit}`);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/categorizer/${id}`);
  return response.data;
};
