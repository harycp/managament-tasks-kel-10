const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const permissionController = require("../controllers/permissionController");
const router = express.Router();

// API FOR PERMISSION
router.post(
  "/permissions",
  authenticate,
  permissionController.createPermission
);
router.get("/permissions", authenticate, permissionController.getPermissions);
router.get(
  "/permissions/:id",
  authenticate,
  permissionController.getPermissionById
);
router.put(
  "/permissions/:id",
  authenticate,
  permissionController.updatePermission
);
router.delete(
  "/permissions/:id",
  authenticate,
  permissionController.deletePermission
);

module.exports = router;
