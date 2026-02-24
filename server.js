import express from "express";
import cors from "cors";
import { redisClient } from "./db/redisClient.js";

const app = express();

// CORS 设置
app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

// 获取浏览量
app.get("/api/stats", async (req, res) => {
  try {
    const pageViews = await redisClient.get("pageViews");
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

// 监听 Render 分配的端口
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));