/**
 * Safely parses and validates AI JSON output.
 * AI can sometimes return markdown code fences or extra text around JSON.
 */

export const parseAIResponse = (rawText) => {
  try {
    // 1. Try direct JSON parse first
    return JSON.parse(rawText);
  } catch {
    // 2. Strip markdown code fences if present (```json ... ```)
    const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      try {
        return JSON.parse(fenceMatch[1].trim());
      } catch {
        // continue
      }
    }

    // 3. Try to extract JSON object from text
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // continue
      }
    }

    throw new Error("Failed to parse AI response as JSON");
  }
};

/**
 * Validates that the parsed categorizer response has all required fields.
 */
export const validateCategorizerResponse = (parsed) => {
  const required = [
    "category",
    "subcategory",
    "sustainability_tags",
    "confidence",
    "reasoning",
  ];

  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`Missing required field in AI response: "${field}"`);
    }
  }

  if (!Array.isArray(parsed.sustainability_tags)) {
    throw new Error('"sustainability_tags" must be an array');
  }

  return true;
};
