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
router.get(
  "/boards/:id/lists",
  authenticate,
  checkRole,
  listController.getLists
);
router.get("/lists/:id", authenticate, listController.getListById);

router.put("/lists/:id", authenticate, listController.updateList);

router.put("/lists/:id/position", authenticate, checkRole, listController.updateListPosition);

router.delete("/lists/:id", authenticate, checkRole, listController.deleteList);

module.exports = router;
