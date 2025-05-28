const workspaceModel = require("../models/workspace");

const workspaceMemberModel = require("../models/workspaceMembers");
const boardEventQueue = require("../workers/queue/boardEventQueue");

/**
 * Module untuk mengelola penugasan user-role.
 * @module workspaceService
 */

/**
 * Membuat workspace baru
 * @async
 * @function createWorkspace
 * @param {Object} workspaceData - Data workspace yang akan dibuat
 * @param {string} workspaceData.name - Nama workspace
 * @param {string} [workspaceData.description] - Deskripsi workspace (opsional)
 * @param {number|string} userId - ID user yang membuat workspace
 * @returns {Promise<Model>} Workspace yang baru dibuat
 * @throws {Error} Jika userId tidak disediakan
 * @example
 * const newWorkspace = await createWorkspace(
 *   { name: 'Project X', description: 'Main project' },
 *   123
 * );
 */
const createWorkspace = async (workspaceData, userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.create({
    ...workspaceData,
    owner_id: userId,
  });

  await boardEventQueue.add("workspaceCreated", {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    ownerId: userId,
  });

  return workspace;
};

const createDefaultWorkspace = async (userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.create({
    name: `Personal Workspace`,
    owner_id: userId,
  });

  await boardEventQueue.add("workspaceCreated", {
    workspaceId: workspace.id,
    workspaceName: "Personal",
    ownerId: userId,
  });

  return workspace;
};

/**
 * Mengambil semua workspace milik user
 * @async
 * @function getWorkspaces
 * @param {number|string} userId - ID user pemilik workspace
 * @returns {Promise<Array<Model>>} Array dari semua workspace user
 * @throws {Error} Jika userId tidak disediakan
 * @example
 * const workspaces = await getWorkspaces(123);
 */
const getWorkspaces = async (userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspaces = await workspaceModel.findAll({
    where: { owner_id: userId },
  });

  return workspaces;
};

/**
 * Mengambil satu workspace berdasarkan ID
 * @async
 * @function getWorkspaceById
 * @param {number|string} workspaceID - ID workspace yang dicari
 * @param {number|string} userId - ID user pemilik workspace
 * @returns {Promise<Model|null>} Workspace yang ditemukan atau null jika tidak ada
 * @throws {Error} Jika userId tidak disediakan
 * @example
 * const workspace = await getWorkspaceById(1, 123);
 */
const getWorkspaceById = async (workspaceID, userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.findOne({
    where: { id: workspaceID, owner_id: userId },
  });

  return workspace;
};

/**
 * Mengupdate data workspace
 * @async
 * @function updateWorkspace
 * @param {number|string} workspaceID - ID workspace yang akan diupdate
 * @param {number|string} userID - ID user pemilik workspace
 * @param {Object} workspaceData - Data baru untuk workspace
 * @param {string} workspaceData.name - Nama baru workspace
 * @returns {Promise<Model>} Workspace yang telah diupdate
 * @throws {Error} Jika userId tidak disediakan atau workspace tidak ditemukan
 * @example
 * const updatedWorkspace = await updateWorkspace(1, 123, {
 *   name: 'Updated Workspace Name'
 * });
 */
const updateWorkspace = async (workspaceID, userID, workspaceData) => {
  if (!userID) throw new Error("Unauthorized: User Id is required");

  const { name } = workspaceData;

  const workspace = await workspaceModel.findOne({
    where: { id: workspaceID, owner_id: userID },
  });

  if (!workspace) throw new Error("Workspace not found");

  return workspace.update({ name });
};

/**
 * Menghapus workspace
 * @async
 * @function deleteWorkspace
 * @param {number|string} workspaceID - ID workspace yang akan dihapus
 * @param {number|string} userID - ID user pemilik workspace
 * @returns {Promise<Model>} Workspace yang telah dihapus
 * @throws {Error} Jika userId tidak disediakan atau workspace tidak ditemukan
 * @example
 * const deletedWorkspace = await deleteWorkspace(1, 123);
 */
const deleteWorkspace = async (workspaceID, userID) => {
  if (!userID) throw new Error("Unauthorized: User Id is required");
  const workspaceMember = await workspaceMemberModel.findOne({
    where: { workspace_id: workspaceID, user_id: userID },
  });

  if (!workspaceMember) throw new Error("Workspace not found");
  workspaceMember.destroy();

  const workspace = await workspaceModel.findOne({
    where: { id: workspaceID, owner_id: userID },
  });

  if (!workspace) throw new Error("Workspace not found");

  return workspace.destroy();
};

module.exports = {
  createWorkspace,
  createDefaultWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
