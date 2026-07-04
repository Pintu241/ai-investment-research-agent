import { model } from "../langchainModel.js";

export const researchNode = async (state) => {
  console.log("1. Research node started");

  const response = await model.invoke(`
You are a company research analyst.

Analyze the company:
${state.company}

Focus on:
- core business
- products and services
- industry
- competitors
- competitive position
- major strengths
- major concerns

Do not invent precise financial figures.

Return a concise company research summary.
`);

  return {
    research: response.content
  };
};