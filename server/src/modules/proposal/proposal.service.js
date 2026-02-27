import aiClient, { AI_MODEL } from "../../config/aiClient.js";
import { parseAIResponse } from "../../utils/aiResponseParser.js";
import {
  buildProposalSystemPrompt,
  buildProposalUserPrompt,
} from "./proposal.prompt.js";
import Proposal from "./proposal.model.js";

export const generateProposal = async (clientData) => {
  const systemPrompt = buildProposalSystemPrompt();
  const userPrompt = buildProposalUserPrompt(clientData);

  const startTime = Date.now();

  try {
    // --- Call OpenAI ---
    const response = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    });

    const rawResponse = response.choices[0].message.content;
    const durationMs = Date.now() - startTime;

    // --- Parse ---
    const parsed = parseAIResponse(rawResponse);

    // --- Save to MongoDB ---
    const result = await Proposal.create({
      input: clientData,
      executive_summary: parsed.executive_summary,
      recommended_products: parsed.recommended_products,
      budget_allocation: parsed.budget_allocation,
      impact_summary: parsed.impact_summary,
      model_used: AI_MODEL,
      duration_ms: durationMs,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllProposals = async (limit = 50) => {
  return Proposal.find().sort({ createdAt: -1 }).limit(limit).lean();
};

export const getProposalById = async (id) => {
  return Proposal.findById(id).lean();
};
