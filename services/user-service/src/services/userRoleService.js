const bcrypt = require("bcryptjs");
const userRole = require("../models/userRoles");

const createRole = async (userRoleData) => {
  const existingRole = await userRole.findOne({
    where: { name: userRoleData.name },
  });
  if (existingRole) throw new Error("Role already exists");

  return await userRole.create({ ...userRoleData });
};

const getRoles = async () => {
  return await userRole.findAll();
};

const getRoleById = async (id) => {
  return await userRole.findByPk(id);
};

const updateRole = async (id, roleData) => {
  const role = await userRole.findByPk(id);
  if (!role) return null;

  await role.update(roleData);
  return role;
};

const deleteRole = async (id) => {
  const role = await userRole.findByPk(id);
  if (!role) return null;
  await role.destroy();
  return role;
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
