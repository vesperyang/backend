import 'dotenv/config'; // 必须最先加载
import express from "express";
import cors from "cors";
import { redisClient } from "./db/redisClient.js";

const app = express();

// CORS 设置
app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

// 根路径返回简单信息
app.get("/", (req, res) => {
  res.json({ message: "Backend is running. Use /api/stats and /api/pageview." });
});

// 获取浏览量
app.get("/api/stats", async (req, res) => {
  try {
    const pageViews = await redisClient.get("pageViews") || 0;
    res.json({ pageViews: Number(pageViews) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 增加浏览量
app.post("/api/pageview", async (req, res) => {
  try {
    const pageViews = await redisClient.incr("pageViews");
    res.json({ pageViews: Number(pageViews) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Render 会分配 PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));