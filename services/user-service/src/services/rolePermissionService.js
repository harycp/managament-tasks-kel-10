const permissionModel = require("../models/permissions");
const userRole = require("../models/userRoles");
const rolePermission = require("../models/rolePermission");
const { where } = require("sequelize");

/**
 * Module untuk mengelola relasi role-permission.
 * @module rolePermissionService
 */

// Membuat relasi antara role dan permission
/**
 * Membuat relasi baru antara role dan permission.
 * @async
 * @function createRolePermission
 * @param {Object} rolePermissionData - Data relasi role-permission yang akan dibuat
 * @param {string} rolePermissionData.role_id - ID role yang akan direlasikan
 * @param {string} rolePermissionData.permission_id - ID permission yang akan direlasikan
 * @returns {Promise<Model>} Relasi role-permission yang baru dibuat
 * @throws {Error} Jika permission atau role tidak ditemukan, atau jika relasi
 *                 role-permission dengan data yang sama sudah ada
 * @example
 * const newRolePermission = await createRolePermission({
 *   role_id: 'role-123',
 *   permission_id: 'permission-456',
 * });
 */
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
/**
 * Mengambil semua relasi role-permission yang tersedia
 * @async
 * @function getRolePermissions
 * @returns {Promise<Array<Model>>} Array berisi semua relasi role-permission
 * @example
 * const rolePermissions = await getRolePermissions();
 * console.log(rolePermissions);
 */
const getRolePermissions = async () => {
  return await rolePermission.findAll();
};

// Mengambil relasi role-permission berdasarkan ID
/**
 * Mengambil relasi role-permission berdasarkan ID
 * @async
 * @function getRolePermissionById
 * @param {number|string} id - ID relasi role-permission yang akan diambil
 * @returns {Promise<Model|Null>} Relasi role-permission yang diambil, atau null jika tidak ditemukan
 * @example
 * const rolePermission = await getRolePermissionById(1);
 * console.log(rolePermission);
 */
const getRolePermissionById = async (id) => {
  return await rolePermission.findByPk(id);
};

// Mengupdate relasi role-permission berdasarkan ID
/**
 * Mengupdate relasi role-permission berdasarkan ID
 * @async
 * @function updateRolePermission
 * @param {number|string} id - ID relasi role-permission yang akan diupdate
 * @param {Object} rolePermissionData - Data relasi role-permission yang diupdate
 * @param {string} rolePermissionData.role_id - ID role yang direlasikan
 * @param {string} rolePermissionData.permission_id - ID permission yang direlasikan
 * @returns {Promise<Model|null>} Relasi role-permission yang diupdate, atau null jika relasi tidak ditemukan
 * @throws {Error} Jika permission atau role tidak ditemukan, atau jika relasi
 *                 role-permission dengan data yang sama sudah ada
 * @example
 * const updatedRolePermission = await updateRolePermission(1, {
 *   role_id: 'role-123',
 *   permission_id: 'permission-456',
 * });
 * console.log(updatedRolePermission);
 */
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
/**
 * Menghapus relasi role-permission berdasarkan ID
 * @async
 * @function deleteRolePermission
 * @param {number|string} id - ID relasi role-permission yang akan dihapus
 * @returns {Promise<Model|Null>} Relasi role-permission yang dihapus, atau null jika tidak ditemukan
 * @example
 * const deletedRolePermission = await deleteRolePermission(1);
 * console.log(deletedRolePermission);
 */
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
