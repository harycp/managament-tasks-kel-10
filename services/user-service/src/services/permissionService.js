const bcrypt = require("bcryptjs");
const permissionModel = require("../models/permissions");

/**
 * Module untuk mengelola data permission.
 * @module permissionService
 */

// Membuat permission baru jika belum ada yang sama
/**
 * Membuat permission baru jika belum ada yang sama.
 * @async
 * @function createPermission
 * @param {Object} permissionData - Data permission yang akan dibuat.
 * @param {string} permissionData.name - Nama permission.
 * @returns {Promise<Model>} Permission yang baru dibuat.
 * @throws {Error} Jika permission dengan nama yang sama sudah ada.
 * @example
 * const newPermission = await createPermission({ name: 'read_articles' });
 * console.log(newPermission);
 */

/**
 * Membuat permission baru jika belum ada yang sama.
 * @async
 * @function createPermission
 * @param {Object} permissionData - Data permission yang akan dibuat.
 * @param {string} permissionData.name - Nama permission.
 * @returns {Promise<Model>} Permission yang baru dibuat.
 * @throws {Error} Jika permission dengan nama yang sama sudah ada.
 * @example
 * const newPermission = await createPermission({ name: 'read_articles' });
 * console.log(newPermission);
 */
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

/**
 * Mengambil semua permission yang tersedia.
 * @async
 * @function getPermissions
 * @returns {Promise<Array<Model>>} Array berisi semua permission.
 * @example
 * const permissions = await getPermissions();
 * console.log(permissions);
 */
const getPermissions = async () => {
  return await permissionModel.findAll();
};

// Mengambil permission berdasarkan ID
/**
 * Mengambil permission berdasarkan ID.
 * @async
 * @function getPermissionById
 * @param {number|string} id - ID permission yang akan diambil.
 * @returns {Promise<Model>} Permission yang diambil, atau null jika tidak ditemukan.
 * @example
 * const permission = await getPermissionById(1);
 * console.log(permission);
 */
const getPermissionById = async (id) => {
  return await permissionModel.findByPk(id);
};

// Mengupdate data permission tertentu berdasarkan ID
/**
 * Mengupdate data permission berdasarkan ID.
 * @async
 * @function updatePermission
 * @param {number|string} id - ID permission yang akan diupdate.
 * @param {Object} permissionData - Data permission yang diupdate.
 * @returns {Promise<Model|null>} Permission yang diupdate, atau null jika permission tidak ditemukan.
 * @example
 * const updatedPermission = await updatePermission(1, { name: "edit_articles" });
 * console.log(updatedPermission);
 */
const updatePermission = async (id, permissionData) => {
  const permission = await permissionModel.findByPk(id);
  if (!permission) return null;

  // Update data permission
  await permission.update(permissionData);
  return permission;
};

// Menghapus permission berdasarkan ID
/**
 * Menghapus permission berdasarkan ID.
 * @async
 * @function deletePermission
 * @param {number|string} id - ID permission yang akan dihapus.
 * @returns {Promise<Model|null>} Permission yang dihapus, atau null jika permission tidak ditemukan.
 * @example
 * const deletedPermission = await deletePermission(1);
 * console.log(deletedPermission);
 */
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
