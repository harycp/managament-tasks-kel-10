const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const rolePermissionController = require("../controllers/rolePermissionController");
const router = express.Router();

// API FOR ROLE PERMISSION
router.post(
  "/rolePermissions",
  authenticate,
  rolePermissionController.createRolePermission
);
router.get(
  "/rolePermissions",
  authenticate,
  rolePermissionController.getRolePermissions
);
router.get(
  "/rolePermissions/:id",
  authenticate,
  rolePermissionController.getRolePermissionById
);
router.put(
  "/rolePermissions/:id",
  authenticate,
  rolePermissionController.updateRolePermission
);
router.delete(
  "/rolePermissions/:id",
  authenticate,
  rolePermissionController.deleteRolePermission
);

module.exports = router;
