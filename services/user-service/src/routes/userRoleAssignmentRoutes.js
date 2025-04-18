const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const userRoleAssignmentController = require("../controllers/userRoleAssignmentsController");
const router = express.Router();

// API FOR USER ROLE ASSIGNMENT
router.post(
  "/userRoleAssignments",
  authenticate,
  userRoleAssignmentController.createUserRoleAssignment
);
router.get(
  "/userRoleAssignments",
  authenticate,
  userRoleAssignmentController.getUserRoleAssignments
);
router.get(
  "/userRoleAssignments/:id",
  authenticate,
  userRoleAssignmentController.getUserRoleAssignmentById
);
router.put(
  "/userRoleAssignments/:id",
  authenticate,
  userRoleAssignmentController.updateUserRoleAssignment
);
router.delete(
  "/userRoleAssignments/:id",
  authenticate,
  userRoleAssignmentController.deleteUserRoleAssignment
);

module.exports = router;
