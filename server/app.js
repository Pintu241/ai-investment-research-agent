import express from "express";
import cors from "cors";
import researchRoutes from "./routes/researchRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Investment Research API is running"
  });
});

app.use("/api/research", researchRoutes);

export default app;