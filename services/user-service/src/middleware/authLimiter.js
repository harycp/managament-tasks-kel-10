// // middleware/rateLimiter.js
// const rateLimit = require('express-rate-limit');
// const RedisStore = require('rate-limit-redis');
// const Redis = require('ioredis');

// const redisClient = new Redis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD || undefined,
// });

// // General login rate limiter (per IP)
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

// Rate limiter: Email registration (prevent abuse)
const registerEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,
  message: {
    message: "Too many registration attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter: Login attempts
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 menit
  max: 5,
  message: {
    message: "Too many login attempts. Please try again in 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter: Password reset requests
const resetPasswordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 menit
  max: 3,
  message: {
    message: "Too many password reset requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter: Email verification
const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 3,
  message: {
    message: "Too many email verifications. Please wait before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  registerEmailLimiter,
  loginLimiter,
  resetPasswordLimiter,
  verifyEmailLimiter,
};
