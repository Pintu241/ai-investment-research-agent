import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { investmentSchema } from "./schemas/investmentSchema.js";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.2
});

export const structuredModel =
  model.withStructuredOutput(investmentSchema);