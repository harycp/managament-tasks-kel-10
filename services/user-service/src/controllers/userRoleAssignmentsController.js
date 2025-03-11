const userRoleAssignmentService = require("../services/userRoleAssignmentsService");

const createUserRoleAssignment = async (req, res) => {
  try {
    const userRoleAssignment =
      await userRoleAssignmentService.createUserRoleAssignment(req.body);
    res.status(201).json({
      message: "User Role Assignment created successfully",
      data: userRoleAssignment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserRoleAssignments = async (req, res) => {
  try {
    const userRoleAssignment =
      await userRoleAssignmentService.getUserRoleAssignments();
    res.status(200).json({
      message: "User Role Assignments retrieved",
      data: userRoleAssignment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRoleAssignmentById = async (req, res) => {
  try {
    const userRoleAssignment =
      await userRoleAssignmentService.getUserRoleAssignmentById(req.params.id);
    if (!userRoleAssignment)
      return res.status(404).json({ message: "Role Permission not found" });
    res.status(200).json({
      message: "User Role Assignment retrieved",
      data: userRoleAssignment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserRoleAssignment = async (req, res) => {
  try {
    const userRoleAssignment =
      await userRoleAssignmentService.updateUserRoleAssignment(
        req.params.id,
        req.body
      );
    if (!userRoleAssignment)
      return res
        .status(404)
        .json({ message: "User Role Assignment not found" });
    res.status(200).json({
      message: "User Role Assignment updated",
      data: userRoleAssignment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUserRoleAssignment = async (req, res) => {
  try {
    const userRoleAssignment =
      await userRoleAssignmentService.deleteUserRoleAssignment(req.params.id);
    if (!userRoleAssignment)
      return res
        .status(404)
        .json({ message: "User Role Assignment not found" });
    res
      .status(200)
      .json({ message: "User Role Assignment deleted", data: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUserRoleAssignment,
  getUserRoleAssignments,
  getUserRoleAssignmentById,
  updateUserRoleAssignment,
  deleteUserRoleAssignment,
};
