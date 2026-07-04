import { investmentPrompt } from "../prompts/investmentPrompt.js";
import { structuredModel } from "../langchainModel.js";

const investmentChain =
  investmentPrompt.pipe(structuredModel);

export const analyzeCompanyWithLangChain =
  async (company) => {
    const result = await investmentChain.invoke({
      company
    });

    return result;
  };