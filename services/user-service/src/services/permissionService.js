const bcrypt = require("bcryptjs");
const permissionModel = require("../models/permissions");

// Membuat permission baru jika belum ada yang sama
const createPermission = async (permissionData) => {
  // Cek apakah permission dengan nama yang sama sudah ada
  const existingPermission = await permissionModel.findOne({
    where: { name: permissionData.name },
  });
  if (existingPermission) throw new Error("Permission already exists");

  // Buat permission baru
  return await permissionModel.create({ ...permissionData });
};

// Mengambil semua permission yang tersedia
const getPermissions = async () => {
  return await permissionModel.findAll();
};

// Mengambil permission berdasarkan ID
const getPermissionById = async (id) => {
  return await permissionModel.findByPk(id);
};

// Mengupdate data permission tertentu berdasarkan ID
const updatePermission = async (id, permissionData) => {
  const permission = await permissionModel.findByPk(id);
  if (!permission) return null;

  // Update data permission
  await permission.update(permissionData);
  return permission;
};

// Menghapus permission berdasarkan ID
const deletePermission = async (id) => {
  const permission = await permissionModel.findByPk(id);
  if (!permission) return null;

  // Hapus permission dari database
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
