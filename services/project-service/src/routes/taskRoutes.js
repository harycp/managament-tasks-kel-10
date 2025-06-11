const authenticate = require("../../../user-service/src/middleware/authMiddleware");
const checkRole = require("../../../workspace-service/src/middleware/checkRole");
const express = require("express");

const taskController = require("../controllers/taskController");

const router = express.Router();

router.post(
  "/lists/:listId/tasks",
  authenticate,
  checkRole,
  taskController.createTask
);

router.put(
  "/tasks/:taskId",
  authenticate,
  checkRole,
  taskController.updateTask
);

router.put(
  "/tasks/:taskId/position",
  authenticate,
  checkRole,
  taskController.updateTaskPosition
);

module.exports = router;
