const boardModel = require("../models/board");
const { getWorkspaceById } = require("./workspaceService");

const createBoard = async (workspaceId, name, token) => {
  const workspace = await getWorkspaceById(workspaceId, token);
  if (!workspace) throw new Error("Workspace not found");

  const board = await boardModel.create({
    workspace_id: workspace.data.id,
    name,
  });

  return board;
};

module.exports = { createBoard };
