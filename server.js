import express from "express";
import cors from "cors";
import { createClient } from "redis";

const app = express();
app.use(cors());
app.use(express.json());

// Redis 客户端
const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();

// 初始化 pageViews
await redisClient.setNX("pageViews", "0");

app.get("/api/stats", async (req, res) => {
  try {
    const pageViews = await redisClient.get("pageViews");
    res.json({ pageViews: Number(pageViews) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 每次访问增加一次浏览量
app.post("/api/pageview", async (req, res) => {
  try {
    const pageViews = await redisClient.incr("pageViews");
    res.json({ pageViews: Number(pageViews) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));