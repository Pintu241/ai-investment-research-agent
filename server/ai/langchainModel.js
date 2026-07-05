import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { investmentSchema } from "./schemas/investmentSchema.js";

let cachedModel = null;
let cachedStructuredModel = null;

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "Please set GEMINI_API_KEY in the environment for AI features"
    );
  }

  if (!cachedModel) {
    cachedModel = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.2
    });
  }

  return cachedModel;
};

const createLazyModel = () => ({
  invoke: async (...args) => {
    const instance = getModel();
    return instance.invoke(...args);
  },
  withStructuredOutput: (schema) => {
    const instance = getModel();
    return instance.withStructuredOutput(schema);
  }
});

export const model = createLazyModel();

export const structuredModel = {
  invoke: async (...args) => {
    if (!cachedStructuredModel) {
      cachedStructuredModel = getModel().withStructuredOutput(investmentSchema);
    }

    return cachedStructuredModel.invoke(...args);
  }
};