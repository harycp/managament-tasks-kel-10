const bcrypt = require("bcryptjs");
const permissionModel = require("../models/permissions");

const createPermission = async (permissionData) => {
  const existingPermission = await permissionModel.findOne({
    where: { name: permissionData.name },
  });
  if (existingPermission) throw new Error("Permission already exists");

  return await permissionModel.create({ ...permissionData });
};

const getPermissions = async () => {
  return await permissionModel.findAll();
};

const getPermissionById = async (id) => {
  return await permissionModel.findByPk(id);
};

const updatePermission = async (id, permissionData) => {
  const permission = await permissionModel.findByPk(id);
  if (!permission) return null;

  await permission.update(permissionData);
  return permission;
};

const deletePermission = async (id) => {
  const permission = await permissionModel.findByPk(id);
  if (!permission) return null;
  await permission.destroy();
  return permission;
};

module.exports = {
  createPermission,
  getPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
};
