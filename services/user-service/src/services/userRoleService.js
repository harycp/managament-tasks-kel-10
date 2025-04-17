const bcrypt = require("bcryptjs");
const userRole = require("../models/userRoles");

// Membuat role baru
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
const getRoles = async () => {
  return await userRole.findAll();
};

// Mengambil satu role berdasarkan ID
const getRoleById = async (id) => {
  return await userRole.findByPk(id);
};

// Mengupdate data role berdasarkan ID
const updateRole = async (id, roleData) => {
  const role = await userRole.findByPk(id);

  // Jika role tidak ditemukan, kembalikan null
  if (!role) return null;

  // Update data role
  await role.update(roleData);
  return role;
};

// Menghapus role berdasarkan ID
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
