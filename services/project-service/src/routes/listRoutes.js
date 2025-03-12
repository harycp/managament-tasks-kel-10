const authenticate = require("../../../user-service/src/middleware/authMiddleware");
const checkRole = require("../../../workspace-service/src/middleware/checkRole");
const express = require("express");
const listController = require("../controllers/listController");
const router = express.Router();

// API FOR BOARDS
router.post(
  "/boards/:id/lists",
  authenticate,
  checkRole,
  listController.createList
);

module.exports = router;
