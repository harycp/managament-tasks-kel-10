const authenticate = require("../../../user-service/src/middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const workspaceMemberController = require("../controllers/workspaceMemberController");

const express = require("express");
const { route } = require("./workspaceRoutes");
const router = express.Router();

// API FOR WORKSPACE
// router.post(
//   "/workspaceMembers",
//   authenticate,
//   checkRole,
//   workspaceMemberController.createWorkspaceMember
// );

router.get(
  "/workspaceMembers/:workspaceId",
  authenticate,
  workspaceMemberController.getWorkspaceMembers
);

// router.get(
//   "/workspaceMembers/:id",
//   authenticate,
//   checkRole,
//   workspaceMemberController.getWorkspaceMemberById
// );

router.put(
  "/workspaceMembers/:id",
  authenticate,
  checkRole,
  workspaceMemberController.updateWorkspaceMember
);

router.delete(
  "/workspaceMembers/:id",
  authenticate,
  checkRole,
  workspaceMemberController.deleteWorkspaceMember
);

router.post(
  "/workspaces/:workspaceId/members",
  authenticate,
  workspaceMemberController.addWorkspaceMember
);

module.exports = router;
