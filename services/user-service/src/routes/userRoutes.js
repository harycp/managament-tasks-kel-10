const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const userRoleController = require("../controllers/userRoleController");
const permissionController = require("../controllers/permissionController");
const rolePermissionController = require("../controllers/rolePermissionController");
const router = express.Router();

// API FOR AUTH AND CRUD USER
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

router.get("/users", authenticate, userController.getUsers);
router.get("/users/:id", authenticate, userController.getUserById);
router.put("/users/:id", authenticate, userController.updateUser);
router.delete("/users/:id", authenticate, userController.deleteUser);

// API FOR USER ROLE
router.post("/roles", userRoleController.createRole);
router.get("/roles", userRoleController.getRoles);
router.get("/roles/:id", userRoleController.getRoleById);
router.put("/roles/:id", userRoleController.updateRole);
router.delete("/roles/:id", userRoleController.deleteRole);

// API FOR PERMISSION
router.post("/permissions", permissionController.createPermission);
router.get("/permissions", permissionController.getPermissions);
router.get("/permissions/:id", permissionController.getPermissionById);
router.put("/permissions/:id", permissionController.updatePermission);
router.delete("/permissions/:id", permissionController.deletePermission);

// API FOR ROLE PERMISSION
router.post("/rolePermissions", rolePermissionController.createRolePermission);
router.get("/rolePermissions", rolePermissionController.getRolePermissions);
router.get(
  "/rolePermissions/:id",
  rolePermissionController.getRolePermissionById
);
router.put(
  "/rolePermissions/:id",
  rolePermissionController.updateRolePermission
);
router.delete(
  "/rolePermissions/:id",
  rolePermissionController.deleteRolePermission
);

module.exports = router;
