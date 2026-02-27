import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const generateProposal = async (clientData) => {
  const response = await axios.post(`${API_URL}/proposal`, clientData);
  return response.data;
};

export const getProposalHistory = async (limit = 50) => {
  const response = await axios.get(`${API_URL}/proposal?limit=${limit}`);
  return response.data;
};

export const getProposalById = async (id) => {
  const response = await axios.get(`${API_URL}/proposal/${id}`);
  return response.data;
};
