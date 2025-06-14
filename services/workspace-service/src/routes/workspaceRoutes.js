const authenticate = require("../../../user-service/src/middleware/authMiddleware");

const express = require("express");
const workspaceController = require("../controllers/workspaceController");
const router = express.Router();

// API FOR WORKSPACE
router.post("/workspaces", authenticate, workspaceController.createWorkspace);
router.get("/workspaces", authenticate, workspaceController.getWorkspaces);

router.get(
  "/workspaces/me",
  authenticate,
  workspaceController.getWorkspacesForUser
);

router.get(
  "/workspaces/:id",
  authenticate,
  workspaceController.getWorkspaceById
);
router.put(
  "/workspaces/:id",
  authenticate, 
  workspaceController.updateWorkspace
);

router.delete(
  "/workspaces/:id",
  authenticate,
  workspaceController.deleteWorkspace
);

module.exports = router;
