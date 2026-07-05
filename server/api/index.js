import app from "../app.js";
import connectDB from "../config/db.js";

let isConnected = false;

export default async function handler(req, res) {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error(
      "Vercel API error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server initialization failed"
    });
  }
}