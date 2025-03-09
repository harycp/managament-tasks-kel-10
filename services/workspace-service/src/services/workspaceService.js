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

module.exports = {
  createWorkspace,
  getWorkspaces,
};
