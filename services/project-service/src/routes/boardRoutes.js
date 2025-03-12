const authenticate = require("../../../user-service/src/middleware/authMiddleware");
const checkRole = require("../../../workspace-service/src/middleware/checkRole");
const express = require("express");
const boardController = require("../controllers/boardController");
const router = express.Router();

// API FOR WORKSPACE
router.post(
  "/workspaces/:id/boards",
  authenticate,
  checkRole,
  boardController.createBoard
);
router.get("/workspaces/:id/boards", authenticate, boardController.getBoards);
router.get("/boards/:id", authenticate, boardController.getBoardById);
router.put("/boards/:id", authenticate, checkRole, boardController.updateBoard);
router.delete(
  "/boards/:id",
  authenticate,
  checkRole,
  boardController.deleteBoard
);

module.exports = router;
