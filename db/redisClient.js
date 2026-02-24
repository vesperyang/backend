import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: process.env.REDIS_URL?.startsWith("rediss://") || false,
    rejectUnauthorized: false
  }
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

await redisClient.connect();

// 初始化 pageViews
await redisClient.setNX("pageViews", "0");