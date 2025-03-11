const authenticate = require("../../../user-service/src/middleware/authMiddleware");

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
router.get("/boards/:id", authenticate, boardController.getBoardById);

module.exports = router;
