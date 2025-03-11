const authenticate = require("../../../user-service/src/middleware/authMiddleware");

const express = require("express");
const boardController = require("../controllers/boardController");
const router = express.Router();

// API FOR WORKSPACE
router.post("/boards/:id", authenticate, boardController.createBoard);

module.exports = router;
