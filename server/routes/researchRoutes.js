import express from "express";
import { createResearch } from "../controllers/researchController.js";

const router = express.Router();

router.post("/", createResearch);

export default router;