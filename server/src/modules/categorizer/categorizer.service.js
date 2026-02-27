import aiClient, { AI_MODEL } from "../../config/aiClient.js";
import {
  parseAIResponse,
  validateCategorizerResponse,
} from "../../utils/aiResponseParser.js";
import {
  buildCategorizerSystemPrompt,
  buildCategorizerUserPrompt,
} from "./categorizer.prompt.js";
import CategorizerResult from "./categorizer.model.js";

export const categorizeProduct = async (productData) => {
  const systemPrompt = buildCategorizerSystemPrompt();
  const userPrompt = buildCategorizerUserPrompt(productData);

  const startTime = Date.now();

  try {
    // --- Call OpenAI ---
    const response = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const rawResponse = response.choices[0].message.content;
    const durationMs = Date.now() - startTime;

    // --- Parse & Validate ---
    const parsed = parseAIResponse(rawResponse);
    validateCategorizerResponse(parsed);

    // --- Save to MongoDB ---
    const result = await CategorizerResult.create({
      input: productData,
      category: parsed.category,
      subcategory: parsed.subcategory,
      sustainability_tags: parsed.sustainability_tags,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      model_used: AI_MODEL,
      duration_ms: durationMs,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllResults = async (limit = 50) => {
  return CategorizerResult.find().sort({ createdAt: -1 }).limit(limit).lean();
};

export const getResultById = async (id) => {
  return CategorizerResult.findById(id).lean();
};
