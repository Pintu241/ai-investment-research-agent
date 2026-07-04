import { model } from "../langchainModel.js";
import {
  decisionSchema
} from "../schemas/decisionSchema.js";

const structuredDecisionModel =
  model.withStructuredOutput(decisionSchema);

export const decisionNode = async (state) => {
  console.log("5. Decision node started");

  const result =
    await structuredDecisionModel.invoke(`
You are the final investment committee.

Company:
${state.company}

Company Research:
${state.research}

Financial Analysis:
${state.financialAnalysis}

News Analysis:
${state.newsAnalysis}

Risk Analysis:
${state.riskAnalysis}

Choose exactly one:
- INVEST
- WATCH
- PASS

Decision principles:
- INVEST only when evidence is sufficiently positive.
- WATCH when evidence is mixed or incomplete.
- PASS when risks materially outweigh strengths.
- Lower confidence when evidence is incomplete.
- Do not invent facts.

Provide:
- decision
- confidence from 0 to 100
- concise reasoning
`);

  return {
    decision: result.decision,
    confidence: result.confidence,
    reasoning: result.reasoning
  };
};