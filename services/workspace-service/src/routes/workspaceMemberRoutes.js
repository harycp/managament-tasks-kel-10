const authenticate = require("../../../user-service/src/middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const workspaceMemberController = require("../controllers/workspaceMemberController");

const express = require("express");
const router = express.Router();

// API FOR WORKSPACE
router.post(
  "/workspaceMember",
  authenticate,
  checkRole,
  workspaceMemberController.createWorkspaceMember
);

module.exports = router;
