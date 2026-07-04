import { GoogleGenAI } from "@google/genai";

console.log(
  "Gemini key loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const analyzeCompany = async (company) => {
  try {
    const prompt = `
You are an investment research assistant.

Analyze the company: ${company}

Return valid JSON only:

{
  "overview": "string",
  "strengths": ["string"],
  "risks": ["string"],
  "decision": "INVEST",
  "confidence": 80,
  "reasoning": "string"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    console.log("Gemini raw response:", response.text);

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};