const workspaceModel = require("../models/workspace");

const workspaceMemberModel = require("../models/workspaceMembers");

const createWorkspace = async (workspaceData, userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.create({
    ...workspaceData,
    owner_id: userId,
  });

  return workspace;
};

const getWorkspaces = async (userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspaces = await workspaceModel.findAll({
    where: { owner_id: userId },
  });

  return workspaces;
};

const getWorkspaceById = async (workspaceID, userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.findOne({
    where: { id: workspaceID, owner_id: userId },
  });

  return workspace;
};

const updateWorkspace = async (workspaceID, userID, workspaceData) => {
  if (!userID) throw new Error("Unauthorized: User Id is required");

  const { name } = workspaceData;

  const workspace = await workspaceModel.findOne({
    where: { id: workspaceID, owner_id: userID },
  });

  if (!workspace) throw new Error("Workspace not found");

  return workspace.update({ name });
};

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
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
