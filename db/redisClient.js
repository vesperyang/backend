import { createClient } from "redis";

// 命名导出，避免 default 报错
export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,                 // Upstash rediss:// 需要 TLS
    rejectUnauthorized: false, // 避免证书验证失败
  }
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

// 异步初始化
(async () => {
  await redisClient.connect();
  await redisClient.setNX("pageViews", "0");
})();