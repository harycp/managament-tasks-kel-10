const user = require("../models/user");
const userRole = require("../models/userRoles");

const userRoleAssignment = require("../models/useRoleAssignments");

const createUserRoleAssignment = async (userRoleAssignmentData) => {
  const { user_id, role_id } = userRoleAssignmentData;

  const existingUser = await user.findByPk(user_id);

  const existingUserRole = await userRole.findByPk(role_id);

  if (!existingUser || !existingUserRole)
    throw new Error("User or Role not found");

  const existingUserRoleAssignment = await userRoleAssignment.findOne({
    where: { user_id, role_id },
  });

  if (existingUserRoleAssignment)
    throw new Error("User Role Assignment already exists");

  return await userRoleAssignment.create({ ...userRoleAssignmentData });
};

const getUserRoleAssignments = async () => {
  return await userRoleAssignment.findAll();
};

const getUserRoleAssignmentById = async (id) => {
  return await userRoleAssignment.findByPk(id);
};

const updateUserRoleAssignment = async (id, userRoleAssignmentData) => {
  const { user_id, role_id } = userRoleAssignmentData;

  const existingUser = await user.findByPk(user_id);
  const existingUserRole = await userRole.findByPk(role_id);

  if (!existingUser || !existingUserRole)
    throw new Error("User or Role not found");

  const existingUserRoleAssignment = await userRoleAssignment.findOne({
    where: { user_id, role_id },
  });

  if (existingUserRoleAssignment)
    throw new Error("User Role Assignment already exists");

  const [updatedRows] = await userRoleAssignment.update(
    { user_id, role_id },
    { where: { id }, returning: true }
  );

  if (updatedRows === 0) return null;

  return await userRoleAssignment.findByPk(id);
};

const deleteUserRoleAssignment = async (id) => {
  const userRoleAssignmentExists = await userRoleAssignment.findByPk(id);
  if (!userRoleAssignmentExists) return null;
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
