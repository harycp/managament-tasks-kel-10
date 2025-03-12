const listModel = require("../models/list");
const boardModel = require("../models/board");

const createList = async (boardId, name) => {
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

module.exports = { createList };
