const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

redis.on("connect", () =>
  console.log("Redis connected", process.env.REDIS_HOST)
);
redis.on("error", (err) => console.error("Redis error:", err));

module.exports = redis;
