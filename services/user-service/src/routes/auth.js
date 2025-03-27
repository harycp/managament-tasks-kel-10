const express = require("express");
const passport = require("../config/passport");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

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
      secure: false, // Gunakan secure=true jika di production (HTTPS) pake NODE_ENV PRODUCTION
      sameSite: "Lax",
      domain: "localhost",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/dashboard");
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
      secure: false, // Gunakan secure=true jika di production (HTTPS) pake NODE_ENV PRODUCTION
      sameSite: "Lax",
      domain: "localhost",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/dashboard");
  }
);

router.get("/check-auth", authenticate, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// API FOR AUTH AND CRUD USER
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
