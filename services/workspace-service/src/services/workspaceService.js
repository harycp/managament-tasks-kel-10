const workspaceModel = require("../models/workspace");

const createWorkspace = async (workspaceData, userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.create({
    ...workspaceData,
    owner_id: userId,
  });

  return workspace;
};

module.exports = {
  createWorkspace,
};
