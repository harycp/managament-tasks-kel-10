const user = require("../models/user");
const userRole = require("../models/userRoles");
const userRoleAssignment = require("../models/useRoleAssignments");

/**
 * Module untuk mengelola penugasan user-role.
 * @module userRoleAssignmentsService
 */

// Membuat penugasan role ke user
/**
 * Membuat penugasan role ke user baru
 * @async
 * @function createUserRoleAssignment
 * @param {Object} userRoleAssignmentData - Data penugasan user-role yang akan dibuat
 * @param {string} userRoleAssignmentData.user_id - ID user yang akan ditugaskan
 * @param {string} userRoleAssignmentData.role_id - ID role yang akan ditugaskan
 * @returns {Promise<Model>} Penugasan user-role yang baru dibuat
 * @throws {Error} Jika user atau role tidak ditemukan, atau jika penugasan
 *                  user-role dengan data yang sama sudah ada
 * @example
 * const newRoleAssignment = await createUserRoleAssignment({
 *   user_id: 'user-123',
 *   role_id: 'role-456',
 * });
 */
const createUserRoleAssignment = async (userRoleAssignmentData) => {
  const { user_id, role_id } = userRoleAssignmentData;

  // Validasi apakah user dan role tersedia
  const existingUser = await user.findByPk(user_id);
  const existingUserRole = await userRole.findByPk(role_id);

  if (!existingUser || !existingUserRole)
    throw new Error("User or Role not found");

  // Cek apakah penugasan tersebut sudah ada
  const existingUserRoleAssignment = await userRoleAssignment.findOne({
    where: { user_id, role_id },
  });

  if (existingUserRoleAssignment)
    throw new Error("User Role Assignment already exists");

  // Buat penugasan user-role baru
  return await userRoleAssignment.create({ ...userRoleAssignmentData });
};

// Mengambil semua penugasan user-role
/**
 * Mengambil semua penugasan user-role yang tersedia
 * @async
 * @function getUserRoleAssignments
 * @returns {Promise<Array<Model>>} Array berisi semua penugasan user-role
 * @example
 * const roleAssignments = await getUserRoleAssignments();
 * console.log(roleAssignments);
 */
const getUserRoleAssignments = async () => {
  return await userRoleAssignment.findAll();
};

// Mengambil penugasan user-role berdasarkan ID
/**
 * Mengambil penugasan user-role berdasarkan ID
 * @async
 * @function getUserRoleAssignmentById
 * @param {number|string} id - ID penugasan user-role yang akan diambil
 * @returns {Promise<Model|null>} Penugasan user-role yang diambil, atau null jika tidak ditemukan
 * @example
 * const roleAssignment = await getUserRoleAssignmentById(1);
 * console.log(roleAssignment);
 */
const getUserRoleAssignmentById = async (id) => {
  return await userRoleAssignment.findByPk(id);
};

// Mengupdate penugasan user-role berdasarkan ID
/**
 * Mengupdate penugasan user-role berdasarkan ID
 * @async
 * @function updateUserRoleAssignment
 * @param {number|string} id - ID penugasan user-role yang akan diupdate
 * @param {Object} userRoleAssignmentData - Data penugasan user-role yang diupdate
 * @returns {Promise<Model|null>} Penugasan user-role yang diupdate, atau null jika tidak ditemukan
 * @example
 * const roleAssignment = await updateUserRoleAssignment(1, { user_id: 1, role_id: 1 });
 * console.log(roleAssignment);
 */
const updateUserRoleAssignment = async (id, userRoleAssignmentData) => {
  const { user_id, role_id } = userRoleAssignmentData;

  // Validasi user dan role
  const existingUser = await user.findByPk(user_id);
  const existingUserRole = await userRole.findByPk(role_id);

  if (!existingUser || !existingUserRole)
    throw new Error("User or Role not found");

  // Cek apakah penugasan baru ini sudah ada
  const existingUserRoleAssignment = await userRoleAssignment.findOne({
    where: { user_id, role_id },
  });

  if (existingUserRoleAssignment)
    throw new Error("User Role Assignment already exists");

  // Update data penugasan user-role
  const [updatedRows] = await userRoleAssignment.update(
    { user_id, role_id },
    { where: { id }, returning: true }
  );

  if (updatedRows === 0) return null;

  return await userRoleAssignment.findByPk(id);
};

// Menghapus penugasan user-role berdasarkan ID
/**
 * Menghapus penugasan user-role berdasarkan ID.
 * @async
 * @function deleteUserRoleAssignment
 * @param {number|string} id - ID penugasan user-role yang akan dihapus.
 * @returns {Promise<Model|null>} Penugasan user-role yang dihapus, atau null jika tidak ditemukan.
 * @example
 * const deletedAssignment = await deleteUserRoleAssignment('assignment-id');
 * console.log(deletedAssignment);
 */
const deleteUserRoleAssignment = async (id) => {
  const userRoleAssignmentExists = await userRoleAssignment.findByPk(id);
  if (!userRoleAssignmentExists) return null;

  // Hapus dari database
  await userRoleAssignmentExists.destroy();
  return userRoleAssignmentExists;
};

module.exports = {
  createUserRoleAssignment,
  getUserRoleAssignments,
  getUserRoleAssignmentById,
  updateUserRoleAssignment,
  deleteUserRoleAssignment,
};
