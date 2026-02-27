import mongoose from "mongoose";

const categorizerResultSchema = new mongoose.Schema(
  {
    // Input fields
    input: {
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number },
      brand: { type: String },
    },

    // AI output fields
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    sustainability_tags: { type: [String], default: [] },
    confidence: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    reasoning: { type: String, required: true },

    // Meta
    model_used: { type: String },
    duration_ms: { type: Number },
  },
  {
    timestamps: true,
  },
);

const CategorizerResult = mongoose.model(
  "CategorizerResult",
  categorizerResultSchema,
);

export default CategorizerResult;
