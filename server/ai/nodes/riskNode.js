import { model } from "../langchainModel.js";

export const riskNode = async (state) => {
  console.log("4. Risk node started");

  const response = await model.invoke(`
You are an investment risk analyst.

Company:
${state.company}

Company research:
${state.research}

Financial analysis:
${state.financialAnalysis}

News analysis:
${state.newsAnalysis}

Identify major risks related to:
- financial health
- debt
- competition
- regulation
- market cycles
- management
- technology disruption
- concentration risk

Do not invent missing evidence.

Return:
- major risks
- risk severity
- key warning signs
`);
  
  return {
    riskAnalysis: response.content
  };
};