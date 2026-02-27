import OpenAI from "openai";

const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_MODEL = process.env.AI_MODEL || "gpt-4o";

export default aiClient;
