const authenticate = require("../middleware/authMiddleware");
const express = require("express");

const taskController = require("../controllers/taskController");

const router = express.Router();

router.post("/lists/:listId/tasks", authenticate, taskController.createTask);

router.put("/tasks/:taskId", authenticate, taskController.updateTask);

router.put(
  "/tasks/:taskId/position",
  authenticate,
  taskController.updateTaskPosition
);

module.exports = router;
