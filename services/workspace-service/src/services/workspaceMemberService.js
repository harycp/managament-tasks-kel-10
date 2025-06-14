const workspaceMemberModel = require("../models/workspaceMembers");
const workspaceModel = require("../models/workspace");
const userService = require("./userServices");

const workspaceEventProducer = require("../kafka/producers/workspaceEventProducer");

const axios = require("axios");
const USER_SERVICE_URL = "http://localhost:5001/api";

// const userModel = require("../../../user-service/src/models/user");

// const userRole = require("../../../user-service/src/models/userRoles");

/**
 * Module untuk mengelola penugasan user workspace.
 * @module workspaceMemberService
 */

/**
 * Membuat workspace member baru
 * @async
 * @function createWorkspaceMember
 * @param {Object} workspaceMemberData - Data workspace member yang akan dibuat
 * @param {number|string} workspaceMemberData.workspace_id - ID workspace yang akan di-assign
 * @param {string} workspaceMemberData.email - Email user yang akan di-assign
 * @param {string} workspaceMemberData.role - Role yang akan di-assign
 * @returns {Promise<Model>} Workspace member yang telah dibuat
 * @throws {Error} Jika email tidak terdaftar, workspace tidak ditemukan, atau user sudah ada di workspace
 * @example
 * const newWorkspaceMember = await createWorkspaceMember({
 *   workspace_id: 1,
 *   email: 'example@example.com',
 *   role: 'member',
 * });
 */
const createWorkspaceMember = async (workspaceMemberData) => {
  const { workspace_id, email, role } = workspaceMemberData;

  const user = await userModel.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const user_id = user.id;

  const workspace = await workspaceModel.findByPk(workspace_id);
  if (!workspace) throw new Error("Workspace not found");

  const workspaceMemberAlready = await workspaceMemberModel.findOne({
    where: { workspace_id, user_id },
  });

  if (workspaceMemberAlready) throw new Error("User already in workspace");

  const isRoleExist = userRole.findOne({ where: { name: role } });
  if (!isRoleExist) throw new Error("Role not found");

  const workspaceMember = await workspaceMemberModel.create({
    workspace_id,
    user_id,
    role,
  });

  return workspaceMember;
};

/**
 * Mengambil semua workspace dan member yang dimiliki oleh user
 * @async
 * @function getWorkspaceMembers
 * @param {number|string} userID - ID user yang akan diambil workspace-nya
 * @returns {Promise<Array<Object>>} Array dari setiap workspace dan member-nya
 * @throws {Error} Jika userID tidak disediakan atau user tidak ditemukan
 * @example
 * const workspaces = await getWorkspaceMembers(123);
 */
// const getWorkspaceMembers = async (userID) => {
//   if (!userID) throw new Error("Unauthorized: User Id is required");

//   const workspaces = await workspaceModel.findAll({
//     where: { owner_id: userID },
//     include: [{ model: workspaceMemberModel, as: "members" }],
//   });

//   if (!workspaces.length) throw new Error("No workspaces found for this user");

//   return workspaces.map((workspace) => ({
//     workspace: {
//       id: workspace.id,
//       name: workspace.name,
//     },
//     members: workspace.members.map((member) => ({
//       id: member.id,
//       user_id: member.user_id,
//       role: member.role,
//     })),
//   }));
// };

/**
 * Mengambil detail workspace member berdasarkan ID
 * @async
 * @function getWorkspaceMemberById
 * @param {number|string} workspaceMemberId - ID workspace member yang akan diambil
 * @param {number|string} userID - ID user yang meminta detail
 * @returns {Promise<Object>} Object berisi detail workspace member, berupa id, user_id, role, dan workspace yang diikutinya
 * @throws {Error} Jika userID tidak disediakan, workspace member tidak ditemukan, atau user tidak berhak mengakses
 * @example
 * const workspaceMember = await getWorkspaceMemberById(1, 123);
 */
const getWorkspaceMemberById = async (workspaceMemberId, userID) => {
  if (!userID) throw new Error("Unauthorized: User ID is required");

  const workspaceMember = await workspaceMemberModel.findByPk(
    workspaceMemberId,
    {
      include: [{ model: workspaceModel, as: "workspace" }],
    }
  );

  if (!workspaceMember) throw new Error("Workspace member not found");

  if (!workspaceMember.workspace) {
    throw new Error("Workspace not found for this member");
  }

  if (workspaceMember.workspace.owner_id !== userID) {
    throw new Error("Unauthorized: You do not have access");
  }

  return {
    id: workspaceMember.id,
    user_id: workspaceMember.user_id,
    role: workspaceMember.role,
    workspace: {
      id: workspaceMember.workspace.id,
      name: workspaceMember.workspace.name,
    },
  };
};

/**
 * Mengupdate data workspace member
 * @async
 * @function updateWorkspaceMember
 * @param {Object} workspaceMemberData - Data baru untuk workspace member
 * @param {number|string} workspaceMemberData.id - ID workspace member yang akan diupdate
 * @param {number|string} workspaceMemberData.workspace_id - ID workspace yang di-assign
 * @param {number|string} workspaceMemberData.user_id - ID user yang di-assign
 * @param {string} workspaceMemberData.role - Role yang di-assign
 * @returns {Promise<Model>} Workspace member yang telah diupdate
 * @throws {Error} Jika user tidak terdaftar, workspace tidak ditemukan, atau user sudah ada di workspace
 * @example
 * const updatedWorkspaceMember = await updateWorkspaceMember({
 *   id: 1,
 *   workspace_id: 1,
 *   user_id: 123,
 *   role: 'member',
 * });
 */
const updateWorkspaceMember = async (workspaceMemberData) => {
  const { id, workspace_id, user_id, role } = workspaceMemberData;

  const workspaceMember = await workspaceMemberModel.findByPk(id);
  if (!workspaceMember) throw new Error("Workspace member not found");

  const user = await userModel.findByPk(user_id);
  if (!user) throw new Error("User not found");

  const workspace = await workspaceModel.findByPk(workspace_id);
  if (!workspace) throw new Error("Workspace not found");

  if (workspaceMember.user_id !== user_id) {
    const workspaceMemberAlready = await workspaceMemberModel.findOne({
      where: { workspace_id, user_id },
    });

    if (workspaceMemberAlready) throw new Error("User already in workspace");
  }

  const isRoleExist = await userRole.findOne({ where: { name: role } });
  if (!isRoleExist) throw new Error("Role not found");

  const [_, updatedMembers] = await workspaceMemberModel.update(
    { role },
    { where: { id }, returning: true }
  );

  return updatedMembers[0];
};

/**
 * Menghapus workspace member
 * @async
 * @function deleteWorkspaceMember
 * @param {number|string} workspaceMemberId - ID workspace member yang akan dihapus
 * @returns {Promise<Model>} Workspace member yang telah dihapus
 * @throws {Error} Jika workspace member tidak ditemukan
 * @example
 * const deletedWorkspaceMember = await deleteWorkspaceMember(1);
 */
const deleteWorkspaceMember = async (workspaceMemberId) => {
  const workspaceMember = await workspaceMemberModel.findByPk(
    workspaceMemberId
  );
  if (!workspaceMember) throw new Error("Workspace member not found");

  return await workspaceMember.destroy();
};

const getWorkspaceMembers = async (userID, workspaceId, token) => {
  if (!userID) throw new Error("Unauthorized: User Id is required");

  const members = await workspaceMemberModel.findAll({
    where: { workspace_id: workspaceId },
    attributes: ["id", "user_id", "role"],
    raw: true,
  });

  const userIds = members.map((member) => member.user_id);

  const userResponse = await userService.userResponse(token, userIds);

  const users = userResponse.data;
  const userMap = new Map(users.map((user) => [user.id, user]));

  const fullMemberDetails = members.map((member) => {
    const userDetails = userMap.get(member.user_id);
    return {
      id: member.user_id,
      name: userDetails.name,
      email: userDetails.email,
      role: member.role,
    };
  });

  return fullMemberDetails;
};

const addMember = async (workspaceId, email, role, token) => {
  if (!email || !role) {
    throw new Error("Email and role are required fields.");
  }

  const responseUser = await userService.findUserByEmail(email, token);
  if (!responseUser || !responseUser.data) {
    throw new Error(
      "Invalid response from User Service when fetching by email."
    );
  }

  const userToAdd = responseUser.data;
  const userId = userToAdd.id;

  const existingMember = await workspaceMemberModel.findOne({
    where: {
      workspace_id: workspaceId,
      user_id: userId,
    },
  });

  if (existingMember) {
    throw new Error("This user is already a member of the workspace.");
  }

  const newMember = await workspaceMemberModel.create({
    workspace_id: workspaceId,
    user_id: userId,
    role: role,
  });

  return newMember;
};

const addMemberById = async (workspaceId, userId, role) => {
  const existingMember = await workspaceMemberModel.findOne({
    where: { workspace_id: workspaceId, user_id: userId },
  });

  if (existingMember) {
    console.log(
      `[WorkspaceService] User ${userId} is already a member of workspace ${workspaceId}. Skipping.`
    );
    return existingMember;
  }

  const newMember = await workspaceMemberModel.create({
    workspace_id: workspaceId,
    user_id: userId,
    role: role,
  });

  console.log(
    `[WorkspaceService] User ${userId} added to workspace ${workspaceId} via Kafka event.`
  );
  return newMember;
};

const removeMember = async (workspaceId, userId) => {
  const result = await workspaceMemberModel.destroy({
    where: {
      workspace_id: workspaceId,
      user_id: userId,
    },
  });

  if (result === 0) {
    throw new Error("Member not found in this workspace.");
  }

  await workspaceEventProducer.sendMemberRemovedEvent({
    workspaceId,
    userId,
  });

  return result;
};

module.exports = {
  createWorkspaceMember,
  getWorkspaceMembers,
  getWorkspaceMemberById,
  updateWorkspaceMember,
  deleteWorkspaceMember,
  addMember,
  addMemberById,
  removeMember,
};
