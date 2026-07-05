import { model } from "../langchainModel.js";

export const newsNode = async (state) => {
  console.log("3. News node started");

  const response = await model.invoke(`
You are a company news analyst.

Company:
${state.company}

Existing research:
${state.research}

Analyze possible recent developments related to:
- product launches
- management changes
- regulatory developments
- partnerships
- expansion
- major controversies
- industry events

Important:
- Do not claim access to live news unless live evidence was supplied.
- Clearly mention uncertainty where current information is unavailable.

Return a concise news and developments analysis.
`);

  return {
    newsAnalysis: response.content
  };
};