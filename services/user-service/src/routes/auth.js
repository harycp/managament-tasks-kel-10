const express = require("express");
const passport = require("../config/passport");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const {
  registerEmailLimiter,
  loginLimiter,
  resetPasswordLimiter,
  verifyEmailLimiter,
} = require("../middleware/authLimiter");

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.token;
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // Gunakan secure=true jika di production (HTTPS) pake NODE_ENV PRODUCTION
      sameSite: "Lax",
      // domain: "localhost",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("https://localhost/h");
  }
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = req.user.token;
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // Gunakan secure=true jika di production (HTTPS) pake NODE_ENV PRODUCTION
      sameSite: "Lax",
      // domain: "localhost",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("https://localhost/h");
  }
);

router.get("/check-auth", authenticate, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// API FOR AUTH AND CRUD USER
router.post("/register", registerEmailLimiter, userController.createUser);
router.post("/login", loginLimiter, userController.loginUser);
router.post("/logout", authenticate, userController.logoutUser);

router.post(
  "/register-email",
  registerEmailLimiter,
  userController.registerEmail
);
router.post("/verify-email", verifyEmailLimiter, userController.verifyEmail);

router.post(
  "/request-reset-password",
  resetPasswordLimiter,
  userController.requestResetPassword
);
router.post("/reset-password", userController.resetPassword);

router.get("/verify-reset-token", userController.verifyResetToken);

module.exports = router;
