const authenticate = require("../middleware/authMiddleware");
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
  boardController.addBoardMembers
);

router.get(
  "/boards/:boardId/members",
  authenticate,
  boardController.getBoardMembers
);

router.get("/boards/me", authenticate, boardController.getBoardsForUser);

router.get("/boards/:id", authenticate, boardController.getBoardById);
router.put("/boards/:id", authenticate, boardController.updateBoard);
router.delete(
  "/boards/:boardId",
  authenticate,
  boardController.deleteBoard
);

module.exports = router;
