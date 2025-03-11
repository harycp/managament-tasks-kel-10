const userRoleService = require("../services/userRoleService");

const createRole = async (req, res) => {
  try {
    const role = await userRoleService.createRole(req.body);
    res.status(201).json({ message: "Role created successfully", data: role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await userRoleService.getRoles();
    res.status(200).json({ message: "Roles retrieved", data: roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await userRoleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role retrieved", data: role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await userRoleService.updateRole(req.params.id, req.body);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role updated", data: role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await userRoleService.deleteRole(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role deleted", data: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
