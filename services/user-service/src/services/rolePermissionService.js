const permissionModel = require("../models/permissions");
const userRole = require("../models/userRoles");
const rolePermission = require("../models/rolePermission");
const { where } = require("sequelize");

// Membuat relasi antara role dan permission
const createRolePermission = async (rolePermissionData) => {
  const { role_id, permission_id } = rolePermissionData;

  // Validasi apakah permission dan role yang dimaksud ada di database
  const existingPermission = await permissionModel.findByPk(permission_id);
  const existingUserRole = await userRole.findByPk(role_id);

  if (!existingPermission || !existingUserRole)
    throw new Error("Permission or Role not found");

  // Cek apakah relasi role-permission sudah pernah dibuat sebelumnya
  const existingRolePermission = await rolePermission.findOne({
    where: { role_id, permission_id },
  });

  if (existingRolePermission) throw new Error("Role Permission already exists");

  // Buat relasi baru antara role dan permission
  return await rolePermission.create({ ...rolePermissionData });
};

// Mengambil semua relasi role-permission
const getRolePermissions = async () => {
  return await rolePermission.findAll();
};

// Mengambil relasi role-permission berdasarkan ID
const getRolePermissionById = async (id) => {
  return await rolePermission.findByPk(id);
};

// Mengupdate relasi role-permission berdasarkan ID
const updateRolePermission = async (id, rolePermissionData) => {
  const { role_id, permission_id } = rolePermissionData;

  // Validasi apakah permission dan role yang dimaksud ada
  const existingPermission = await permissionModel.findByPk(permission_id);
  const existingUserRole = await userRole.findByPk(role_id);

  if (!existingPermission || !existingUserRole)
    throw new Error("Permission or Role not found");

  // Cek apakah kombinasi role-permission tersebut sudah ada
  const existingRolePermission = await rolePermission.findOne({
    where: { role_id, permission_id },
  });

  if (existingRolePermission) throw new Error("Role Permission already exists");

  // Update data role-permission
  const [updatedRows] = await rolePermission.update(
    { role_id, permission_id },
    { where: { id }, returning: true }
  );

  if (updatedRows === 0) return null;

  return await rolePermission.findByPk(id);
};

// Menghapus relasi role-permission berdasarkan ID
const deleteRolePermission = async (id) => {
  const rolePermissionExists = await rolePermission.findByPk(id);
  if (!rolePermissionExists) return null;

  // Hapus data dari database
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
