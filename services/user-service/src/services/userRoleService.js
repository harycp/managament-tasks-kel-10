const bcrypt = require("bcryptjs");
const userRole = require("../models/userRoles");

/**
 * Service untuk manajemen role pengguna
 * @module userRoleService
 */

/**
 * Membuat role baru
 * @async
 * @function createRole
 * @param {Object} userRoleData - Data role yang akan dibuat
 * @param {string} userRoleData.name - Nama role
 * @param {string} [userRoleData.description] - Deskripsi role (opsional)
 * @returns {Promise<Model>} Role yang baru dibuat
 * @throws {Error} Jika role dengan nama yang sama sudah ada
 * @example
 * const newRole = await createRole({
 *   name: 'admin',
 *   description: 'Administrator role'
 * });
 */
const createRole = async (userRoleData) => {
  // Cek apakah role dengan nama tersebut sudah ada
  const existingRole = await userRole.findOne({
    where: { name: userRoleData.name },
  });

  if (existingRole) throw new Error("Role already exists");

  // Buat role baru
  return await userRole.create({ ...userRoleData });
};

// Mengambil semua role yang tersedia
/**
 * Mengambil semua role yang tersedia dari database.
 * @async
 * @function getRoles
 * @returns {Promise<Array<Model>>} Array berisi semua role.
 * @example
 * const roles = await getRoles();
 * console.log(roles);
 */
const getRoles = async () => {
  return await userRole.findAll();
};

// Mengambil satu role berdasarkan ID

/**
 * Mengambil satu role berdasarkan ID-nya
 * @async
 * @function getRoleById
 * @param {number|string} id - ID role yang akan diambil
 * @returns {Promise<Model>} Role yang diambil, atau null jika role tidak ditemukan
 * @example
 * const role = await getRoleById(1);
 * console.log(role);
 */
const getRoleById = async (id) => {
  return await userRole.findByPk(id);
};

// Mengupdate data role berdasarkan ID

/**
 * Mengupdate data role berdasarkan ID
 * @async
 * @function updateRole
 * @param {number|string} id - ID role yang akan diupdate
 * @param {Object} roleData - Data role yang diupdate
 * @returns {Promise<Model|Null>} Role yang diupdate, atau null jika role tidak ditemukan
 * @example
 * const role = await updateRole(1, { name: "Super Admin" });
 * console.log(role);
 */
const updateRole = async (id, roleData) => {
  const role = await userRole.findByPk(id);

  // Jika role tidak ditemukan, kembalikan null
  if (!role) return null;

  // Update data role
  await role.update(roleData);
  return role;
};

// Menghapus role berdasarkan ID

/**
 * Menghapus role berdasarkan ID
 * @async
 * @function deleteRole
 * @param {number|string} id - ID role yang akan dihapus
 * @returns {Promise<Model|Null>} Role yang dihapus, atau null jika role tidak ditemukan
 * @example
 * const role = await deleteRole(1);
 * console.log(role);
 */
const deleteRole = async (id) => {
  const role = await userRole.findByPk(id);
  if (!role) return null;

  // Hapus role dari database
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
