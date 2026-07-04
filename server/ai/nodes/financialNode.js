import { model } from "../langchainModel.js";

export const financialNode = async (state) => {
  console.log("2. Financial node started");

  const response = await model.invoke(`
You are a cautious financial analyst.

Company:
${state.company}

Existing company research:
${state.research}

Analyze:
- revenue growth quality
- profitability
- debt concerns
- cash flow quality
- margin trends
- valuation concerns

Important:
- Do not invent precise numbers.
- If verified financial data is unavailable, clearly mention that limitation.
- Separate known information from assumptions.

Return a concise financial analysis.
`);

  return {
    financialAnalysis: response.content
  };
};