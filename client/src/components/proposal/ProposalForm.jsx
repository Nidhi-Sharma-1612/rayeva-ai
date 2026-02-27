import { useState } from "react";
import {
  PRODUCT_CATEGORIES,
  SUSTAINABILITY_FILTERS,
} from "../../utils/constants";

const ProposalForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    budget: "",
    categories: [],
    sustainability_preferences: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((v) => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, budget: parseFloat(formData.budget) });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-800">Generate B2B Proposal</h2>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          required
          placeholder="e.g. GreenTech Solutions"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry *
        </label>
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          required
          placeholder="e.g. Information Technology"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Budget ($) *
        </label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          required
          min="1"
          placeholder="e.g. 50000"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Product Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Categories of Interest *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.categories.includes(cat)}
                onChange={() => handleCheckbox("categories", cat)}
                className="accent-green-500"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Sustainability Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sustainability Preferences *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SUSTAINABILITY_FILTERS.map((pref) => (
            <label
              key={pref}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.sustainability_preferences.includes(pref)}
                onChange={() =>
                  handleCheckbox("sustainability_preferences", pref)
                }
                className="accent-green-500"
              />
              {pref}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        {loading ? "Generating Proposal..." : "Generate Proposal"}
      </button>
    </form>
  );
};

export default ProposalForm;
