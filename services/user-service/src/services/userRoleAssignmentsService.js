const user = require("../models/user");
const userRole = require("../models/userRoles");
const userRoleAssignment = require("../models/useRoleAssignments");

// Membuat penugasan role ke user
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
const getUserRoleAssignments = async () => {
  return await userRoleAssignment.findAll();
};

// Mengambil penugasan user-role berdasarkan ID
const getUserRoleAssignmentById = async (id) => {
  return await userRoleAssignment.findByPk(id);
};

// Mengupdate penugasan user-role berdasarkan ID
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
