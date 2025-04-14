// // middleware/rateLimiter.js
// const rateLimit = require('express-rate-limit');
// const RedisStore = require('rate-limit-redis');
// const Redis = require('ioredis');

// const redisClient = new Redis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD || undefined,
// });

// General login rate limiter (per IP)
// const loginLimiter = rateLimit({
//   store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 5,
//   keyGenerator: (req) => req.ip,
//   handler: (req, res) => {
//     return res.status(429).json({
//       message: 'Too many login attempts. Please try again later.',
//     });
//   },
// });

// // Registration limiter (based on IP)
// const registerLimiter = rateLimit({
//   store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3,
//   keyGenerator: (req) => req.ip,
//   handler: (req, res) => {
//     return res.status(429).json({
//       message: 'Too many registration attempts from this IP. Try again later.',
//     });
//   },
// });

// // Forgot password limiter (based on email)
// const forgotPasswordLimiter = rateLimit({
//   store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 3,
//   keyGenerator: (req) => req.body.email || req.ip,
//   handler: (req, res) => {
//     return res.status(429).json({
//       message: 'Too many password reset requests. Please check your email or try again later.',
//     });
//   },
// });

// module.exports = {
//   loginLimiter,
//   registerLimiter,
//   forgotPasswordLimiter,
// };

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

// Rate limiter: Email registration
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
