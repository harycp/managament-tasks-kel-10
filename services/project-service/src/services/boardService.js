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

const getBoards = async (workspaceId, token) => {
  const workspace = await getWorkspaceById(workspaceId, token);
  if (!workspace) throw new Error("Workspace not found");

  const boards = await boardModel.findAll({
    where: {
      workspace_id: workspace.data.id,
    },
  });

  return boards;
};

const getBoardById = async (boardId) => {
  const board = await boardModel.findByPk(boardId);
  return board;
};

const updateBoard = async (boardId, name) => {
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found");
  if (board.name === name) return board;

  return board.update({ name });
};

const deleteBoard = async (boardId) => {
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found");

  return board.destroy();
};

module.exports = {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};
