export const buildProposalSystemPrompt = () =>
  `
You are an expert B2B sustainable procurement consultant.
Your job is to generate a detailed procurement proposal for a business client.

You MUST respond with ONLY valid JSON — no extra text, no markdown, no explanation.

Your response must follow this exact JSON schema:
{
  "executive_summary": "<2-3 sentence overview of the proposal>",
  "recommended_products": [
    {
      "name": "<product name>",
      "category": "<product category>",
      "sustainability_tags": ["<tag1>", "<tag2>"],
      "unit_cost": <number>,
      "recommended_quantity": <number>,
      "total_cost": <number>,
      "justification": "<1-2 sentence reason for recommendation>"
    }
  ],
  "budget_allocation": {
    "total_budget": <number>,
    "total_spent": <number>,
    "remaining_budget": <number>,
    "allocation_breakdown": [
      {
        "category": "<category name>",
        "amount": <number>,
        "percentage": <number>
      }
    ]
  },
  "impact_summary": {
    "environmental_impact": "<description>",
    "esg_compliance": "<description>",
    "brand_reputation": "<description>",
    "estimated_carbon_reduction": "<e.g. 20% reduction in carbon footprint>"
  }
}
`.trim();

export const buildProposalUserPrompt = ({
  company_name,
  industry,
  budget,
  categories,
  sustainability_preferences,
}) =>
  `
Generate a B2B sustainable procurement proposal for the following client:

Company Name: ${company_name}
Industry: ${industry}
Total Budget: $${budget}
Product Categories of Interest: ${categories.join(", ")}
Sustainability Preferences: ${sustainability_preferences.join(", ")}

Requirements:
- Recommend exactly 5 sustainable products
- Stay within the total budget
- Each product must have at least 2 sustainability tags
- Allocate budget wisely across different categories
- Make the impact summary specific to the client's industry

Return only the JSON object.
`.trim();
