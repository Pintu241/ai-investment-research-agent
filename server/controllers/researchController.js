import Research from "../models/Research.js";
import connectDB from "../config/db.js";

export const createResearch = async (req, res) => {
  let researchRecord;

  try {
    await connectDB();

    const { company } = req.body;

    if (!company || !company.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required"
      });
    }

    researchRecord = await Research.create({
      company: company.trim(),
      status: "pending",
      user: req.user._id
    });

    const { investmentGraph } = await import("../ai/graph/investmentGraph.js");

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

    researchRecord.businessScore =
      result.businessScore || 50;

    researchRecord.financialScore =
      result.financialScore || 50;

    researchRecord.newsScore =
      result.newsScore || 50;

    researchRecord.riskScore =
      result.riskScore || 50;

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

export const getResearchHistory = async (req, res) => {
  try {
    await connectDB();
    const history = await Research.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error("Get history error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch research history",
      error: error.message
    });
  }
};

export const getResearchById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const research = await Research.findOne({ _id: id, user: req.user._id });
    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research report not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: research
    });
  } catch (error) {
    console.error("Get research by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch research report",
      error: error.message
    });
  }
};

export const deleteResearch = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const research = await Research.findOneAndDelete({ _id: id, user: req.user._id });
    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research report not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Research report deleted successfully"
    });
  } catch (error) {
    console.error("Delete research error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete research report",
      error: error.message
    });
  }
};

export const toggleSaveResearch = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const research = await Research.findOne({ _id: id, user: req.user._id });
    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research report not found"
      });
    }
    research.saved = !research.saved;
    await research.save();
    return res.status(200).json({
      success: true,
      message: research.saved ? "Report saved to bookmarks" : "Report removed from bookmarks",
      data: research
    });
  } catch (error) {
    console.error("Toggle save error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update bookmark status",
      error: error.message
    });
  }
};