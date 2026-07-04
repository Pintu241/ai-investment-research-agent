import mongoose from "mongoose";

const researchSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        },

        overview: {
            type: String,
            default: ""
        },
        research: {
            type: String,
            default: ""
        },

        financialAnalysis: {
            type: String,
            default: ""
        },

        newsAnalysis: {
            type: String,
            default: ""
        },

        riskAnalysis: {
            type: String,
            default: ""
        },

        strengths: {
            type: [String],
            default: []
        },

        risks: {
            type: [String],
            default: []
        },

        decision: {
            type: String,
            enum: ["INVEST", "WATCH", "PASS", null],
            default: null
        },

        confidence: {
            type: Number,
            min: 0,
            max: 100,
            default: null
        },

        reasoning: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Research = mongoose.model(
    "Research",
    researchSchema
);

export default Research;