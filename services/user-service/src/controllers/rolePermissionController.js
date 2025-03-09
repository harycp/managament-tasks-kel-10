const rolePermissionService = require("../services/rolePermissionService");

const createRolePermission = async (req, res) => {
  try {
    const rolePermission = await rolePermissionService.createRolePermission(
      req.body
    );
    res.status(201).json({
      message: "Role Permission created successfully",
      rolePermission,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRolePermissions = async (req, res) => {
  try {
    const rolePermissions = await rolePermissionService.getRolePermissions();
    res.status(200).json(rolePermissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRolePermissionById = async (req, res) => {
  try {
    const rolePermission = await rolePermissionService.getRolePermissionById(
      req.params.id
    );
    if (!rolePermission)
      return res.status(404).json({ message: "Role Permission not found" });
    res.status(200).json(rolePermission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRolePermission = async (req, res) => {
  try {
    const rolePermission = await rolePermissionService.updateRolePermission(
      req.params.id,
      req.body
    );
    if (!rolePermission)
      return res.status(404).json({ message: "Role Permission not found" });
    res.status(200).json(rolePermission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRolePermission = async (req, res) => {
  try {
    const rolePermission = await rolePermissionService.deleteRolePermission(
      req.params.id
    );
    if (!rolePermission)
      return res.status(404).json({ message: "Role Permission not found" });
    res.status(200).json({ message: "Role Permission deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRolePermission,
  getRolePermissions,
  getRolePermissionById,
  updateRolePermission,
  deleteRolePermission,
};
