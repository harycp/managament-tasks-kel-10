const authenticate = require("../../../user-service/src/middleware/authMiddleware");
const checkRole = require("../../../workspace-service/src/middleware/checkRole");
const express = require("express");
const boardController = require("../controllers/boardController");
const router = express.Router();

// API FOR WORKSPACE
router.post(
  "/workspaces/:id/boards",
  authenticate,
  boardController.createBoard
);
router.get("/workspaces/:id/boards", authenticate, boardController.getBoards);

router.post(
  "/boards/:boardId/members",
  authenticate,
  checkRole,
  boardController.addBoardMembers
);

router.get(
  "/boards/:boardId/members",
  authenticate,
  checkRole,
  boardController.getBoardMembers
);

router.get("/boards/me", authenticate, boardController.getBoardsForUser);

router.get("/boards/:id", authenticate, boardController.getBoardById);
router.put("/boards/:id", authenticate, checkRole, boardController.updateBoard);
router.delete(
  "/boards/:boardId",
  authenticate,
  checkRole,
  boardController.deleteBoard
);

module.exports = router;
