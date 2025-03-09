const workspaceModel = require("../models/workspace");

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

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById
};
