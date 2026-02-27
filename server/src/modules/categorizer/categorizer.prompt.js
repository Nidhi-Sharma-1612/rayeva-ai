import {
  PRODUCT_CATEGORIES,
  SUSTAINABILITY_FILTERS,
} from "../../utils/constants.js";

export const buildCategorizerSystemPrompt = () =>
  `
You are an expert e-commerce product categorization assistant.
Your job is to analyze product information and return a structured JSON classification.

You MUST respond with ONLY valid JSON — no extra text, no markdown, no explanation.

Available top-level categories:
${PRODUCT_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Available sustainability tags (select all that apply, or ["None"]):
${SUSTAINABILITY_FILTERS.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Your response must follow this exact JSON schema:
{
  "category": "<one of the categories above>",
  "subcategory": "<a specific subcategory within the category>",
  "sustainability_tags": ["<tag1>", "<tag2>"],
  "confidence": "<High | Medium | Low>",
  "reasoning": "<1-2 sentence explanation of your classification>"
}
`.trim();

export const buildCategorizerUserPrompt = ({
  name,
  description,
  price,
  brand,
}) =>
  `
Categorize the following product:

Product Name: ${name}
${brand ? `Brand: ${brand}` : ""}
${price !== undefined ? `Price: $${price}` : ""}
${description ? `Description: ${description}` : ""}

Return only the JSON object.
`.trim();
