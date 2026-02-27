import { useState } from "react";
import {
  generateProposal,
  getProposalHistory,
} from "../services/proposalService";

const useProposal = () => {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (clientData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateProposal(clientData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProposalHistory();
      setHistory(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  return { result, history, loading, error, generate, fetchHistory };
};

export default useProposal;
