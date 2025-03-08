const permissionModel = require("../models/permissions");
const userRole = require("../models/userRoles");

const rolePermission = require("../models/rolePermission");
const { where } = require("sequelize");

const createRolePermission = async (rolePermissionData) => {
  const { role_id, permission_id } = rolePermissionData;

  const existingPermission = await permissionModel.findByPk(permission_id);

  const existingUserRole = await userRole.findByPk(role_id);

  if (!existingPermission || !existingUserRole)
    throw new Error("Permission or Role not found");

  const existingRolePermission = await rolePermission.findOne({
    where: { role_id, permission_id },
  });

  if (existingRolePermission) throw new Error("Role Permission already exists");

  return await rolePermission.create({ ...rolePermissionData });
};

const getRolePermissions = async () => {
  return await rolePermission.findAll();
};

const getRolePermissionById = async (id) => {
  return await rolePermission.findByPk(id);
};

const updateRolePermission = async (id, rolePermissionData) => {
  const { role_id, permission_id } = rolePermissionData;

  const existingPermission = await permissionModel.findByPk(permission_id);
  const existingUserRole = await userRole.findByPk(role_id);

  if (!existingPermission || !existingUserRole)
    throw new Error("Permission or Role not found");

  const existingRolePermission = await rolePermission.findOne({
    where: { role_id, permission_id },
  });

  if (existingRolePermission) throw new Error("Role Permission already exists");

  const [updatedRows] = await rolePermission.update(
    { role_id, permission_id },
    { where: { id }, returning: true }
  );

  if (updatedRows === 0) return null;

  return await rolePermission.findByPk(id);
};

const deleteRolePermission = async (id) => {
  const rolePermissionExists = await rolePermission.findByPk(id);
  if (!rolePermissionExists) return null;
  await rolePermissionExists.destroy();
  return rolePermissionExists;
};

module.exports = {
  createRolePermission,
  getRolePermissions,
  getRolePermissionById,
  updateRolePermission,
  deleteRolePermission,
};
