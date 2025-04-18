const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const userRoleController = require("../controllers/userRoleController");
const router = express.Router();

// API FOR USER ROLE
router.post("/roles", authenticate, userRoleController.createRole);
router.get("/roles", authenticate, userRoleController.getRoles);
router.get("/roles/:id", authenticate, userRoleController.getRoleById);
router.put("/roles/:id", authenticate, userRoleController.updateRole);
router.delete("/roles/:id", authenticate, userRoleController.deleteRole);

module.exports = router;
