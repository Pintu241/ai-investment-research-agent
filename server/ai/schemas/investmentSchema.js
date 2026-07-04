import { z } from "zod";

export const investmentSchema = z.object({
  overview: z
    .string()
    .describe("Short overview of the company"),

  strengths: z
    .array(z.string())
    .describe("Main business strengths"),

  risks: z
    .array(z.string())
    .describe("Main investment risks"),

  decision: z
    .enum(["INVEST", "WATCH", "PASS"])
    .describe("Preliminary investment decision"),

  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("Confidence score from 0 to 100"),

  reasoning: z
    .string()
    .describe("Short reasoning behind the decision")
});