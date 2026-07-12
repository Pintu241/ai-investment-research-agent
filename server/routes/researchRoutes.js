import express from "express";
import {
  createResearch,
  getResearchHistory,
  getResearchById,
  deleteResearch,
  toggleSaveResearch
} from "../controllers/researchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createResearch);
router.get("/", getResearchHistory);
router.get("/:id", getResearchById);
router.delete("/:id", deleteResearch);
router.patch("/:id/toggle-save", toggleSaveResearch);

export default router;