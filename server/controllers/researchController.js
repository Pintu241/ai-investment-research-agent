import Research from "../models/Research.js";
import {
  investmentGraph
} from "../ai/graph/investmentGraph.js";

export const createResearch = async (req, res) => {
  let researchRecord;

  try {
    const { company } = req.body;

    if (!company || !company.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required"
      });
    }

    researchRecord = await Research.create({
      company: company.trim(),
      status: "pending"
    });

    const result =
      await investmentGraph.invoke({
        company: company.trim()
      });

    researchRecord.research =
      result.research;

    researchRecord.financialAnalysis =
      result.financialAnalysis;

    researchRecord.newsAnalysis =
      result.newsAnalysis;

    researchRecord.riskAnalysis =
      result.riskAnalysis;

    researchRecord.decision =
      result.decision;

    researchRecord.confidence =
      result.confidence;

    researchRecord.reasoning =
      result.reasoning;

    researchRecord.status =
      "completed";

    await researchRecord.save();

    return res.status(201).json({
      success: true,
      message:
        "Investment research completed",
      data: researchRecord
    });

  } catch (error) {
    console.error(
      "Investment graph error:",
      error
    );

    if (researchRecord) {
      researchRecord.status = "failed";

      await researchRecord
        .save()
        .catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message:
        "Investment research failed",
      error: error.message
    });
  }
};