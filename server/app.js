import express from "express";
import cors from "cors";
import researchRoutes from "./routes/researchRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Investment Research API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/research", researchRoutes);

export default app;