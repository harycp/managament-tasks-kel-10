const authenticate = require("../../../user-service/src/middleware/authMiddleware");

const express = require("express");
const workspaceController = require("../controllers/workspaceController");
const router = express.Router();

// API FOR WORKSPACE
router.post("/workspaces", authenticate, workspaceController.createWorkspace);
router.get("/workspaces", authenticate, workspaceController.getWorkspaces);

module.exports = router;
