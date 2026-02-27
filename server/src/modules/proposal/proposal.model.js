import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    // Input fields
    input: {
      company_name: { type: String, required: true },
      industry: { type: String, required: true },
      budget: { type: Number, required: true },
      categories: { type: [String], required: true },
      sustainability_preferences: { type: [String], required: true },
    },

    // AI output fields
    executive_summary: { type: String, required: true },
    recommended_products: [
      {
        name: { type: String },
        category: { type: String },
        sustainability_tags: { type: [String] },
        unit_cost: { type: Number },
        recommended_quantity: { type: Number },
        total_cost: { type: Number },
        justification: { type: String },
      },
    ],
    budget_allocation: {
      total_budget: { type: Number },
      total_spent: { type: Number },
      remaining_budget: { type: Number },
      allocation_breakdown: [
        {
          category: { type: String },
          amount: { type: Number },
          percentage: { type: Number },
        },
      ],
    },
    impact_summary: {
      environmental_impact: { type: String },
      esg_compliance: { type: String },
      brand_reputation: { type: String },
      estimated_carbon_reduction: { type: String },
    },

    // Meta
    model_used: { type: String },
    duration_ms: { type: Number },
  },
  {
    timestamps: true,
  },
);

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;
