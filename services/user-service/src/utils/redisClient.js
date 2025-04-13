const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

redis.on("connect", () =>
  console.log("Redis connected", process.env.REDIS_HOST)
);
redis.on("error", (err) => console.error("Redis error:", err));

module.exports = redis;
