const express = require("express");
const passport = require("../config/passport");
const router = express.Router();
const userController = require("../controllers/userController");

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
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
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
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

// API FOR AUTH AND CRUD USER
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
