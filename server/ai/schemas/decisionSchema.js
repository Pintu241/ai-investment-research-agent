import { z } from "zod";

export const decisionSchema = z.object({
  decision: z.enum([
    "INVEST",
    "WATCH",
    "PASS"
  ]),

  confidence: z
    .number()
    .min(0)
    .max(100),

  reasoning: z.string(),

  businessScore: z
    .number()
    .min(0)
    .max(100)
    .default(50),

  financialScore: z
    .number()
    .min(0)
    .max(100)
    .default(50),

  newsScore: z
    .number()
    .min(0)
    .max(100)
    .default(50),

  riskScore: z
    .number()
    .min(0)
    .max(100)
    .default(50)
});