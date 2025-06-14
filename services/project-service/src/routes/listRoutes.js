const authenticate = require("../middleware/authMiddleware");
const express = require("express");
const listController = require("../controllers/listController");
const router = express.Router();

// API FOR BOARDS
router.post("/boards/:id/lists", authenticate, listController.createList);
router.get("/boards/:id/lists", authenticate, listController.getLists);
router.get("/lists/:id", authenticate, listController.getListById);

router.put("/lists/:id", authenticate, listController.updateList);

router.put(
  "/lists/:id/position",
  authenticate,
  listController.updateListPosition
);

router.delete("/lists/:id", authenticate, listController.deleteList);

module.exports = router;
