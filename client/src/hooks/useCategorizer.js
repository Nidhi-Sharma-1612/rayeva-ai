import { useState } from "react";
import {
  categorizeProduct,
  getCategoryHistory,
} from "../services/categorizerService";

const useCategorizer = () => {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categorize = async (productData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await categorizeProduct(productData);
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
      const response = await getCategoryHistory();
      setHistory(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  return { result, history, loading, error, categorize, fetchHistory };
};

export default useCategorizer;
