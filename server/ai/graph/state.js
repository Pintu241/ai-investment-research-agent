import { Annotation } from "@langchain/langgraph";

export const InvestmentState = Annotation.Root({
  company: Annotation(),

  research: Annotation(),

  financialAnalysis: Annotation(),

  newsAnalysis: Annotation(),

  riskAnalysis: Annotation(),

  decision: Annotation(),

  confidence: Annotation(),

  reasoning: Annotation()
});