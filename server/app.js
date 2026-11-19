import express from "express";
import cors from "cors";
import client from "prom-client";
import researchRoutes from "./routes/researchRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

client.collectDefaultMetrics();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Investment Research API is running"
  });
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/research", researchRoutes);

export default app;