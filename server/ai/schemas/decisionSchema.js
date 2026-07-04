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

  reasoning: z.string()
});