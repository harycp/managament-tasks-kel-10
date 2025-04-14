const rateLimit = require("express-rate-limit");
const redisClient = require("../utils/redisClient");
const rateLimitRedis = require("rate-limit-redis").default;

const createRedisLimiter = (options) =>
  rateLimit({
    store: new rateLimitRedis({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: "ratelimit_",
    }),
    keyGenerator: (req) => {
      let ip =
        (req.headers["x-forwarded-for"] || "").split(",").shift().trim() ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip;

      if (ip === "::1" || ip === "1") ip = "127.0.0.1";

      const formattedIp = ip.replace(/[:.]/g, "_");

      const cleanIp = formattedIp === "::1" ? "127_0_0_1" : formattedIp;

      const action = options.action || "default";

      return `${action}_${cleanIp}`;
    },
    ...options,
    standardHeaders: true,
    legacyHeaders: false,
  });

const registerEmailLimiter = createRedisLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  action: "register-email",
  message: {
    message: "Too many registration attempts. Please try again in 15 minutes.",
  },
});

const loginLimiter = createRedisLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  action: "login",
  message: {
    message: "Too many login attempts. Please try again in 10 minutes.",
  },
});

const resetPasswordLimiter = createRedisLimiter({
  windowMs: 30 * 60 * 1000,
  max: 3,
  action: "reset-password",
  message: {
    message: "Too many password reset requests. Please try again later.",
  },
});

const verifyEmailLimiter = createRedisLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  action: "verify-email",
  message: {
    message: "Too many email verifications. Please wait before trying again.",
  },
});

module.exports = {
  registerEmailLimiter,
  loginLimiter,
  resetPasswordLimiter,
  verifyEmailLimiter,
};
