const listModel = require("../models/list");
const boardModel = require("../models/board");
const workspace = require("../../../workspace-service/src/models/workspace");

const createList = async (boardId, name) => {
  if (!boardId) throw new Error("Unauthorized: Board Id is required");
  const board = await boardModel.findByPk(boardId);
  if (!board) throw new Error("Board not found");

  const existingLists = await listModel.count({
    where: { board_id: boardId },
  });

  const newList = await listModel.create({
    board_id: boardId,
    name,
    position: existingLists + 1,
  });

  return newList;
};

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

const getLists = async (boardId) => {
  if (!boardId) throw new Error("Unauthorized: Board Id is required");

  const board = await boardModel.findByPk(boardId, {
    include: [{ model: listModel, as: "lists" }],
  });
  if (!board) throw new Error("Board not found");

  return {
    board: {
      id: board.id,
      name: board.name,
      workspace_id: board.workspace_id,
    },
    lists: board.lists,
  };
};

module.exports = { createList, getLists };
