const { Op, Sequelize } = require("sequelize");

const listModel = require("../models/list");
const boardModel = require("../models/board");

const createList = async (boardId, name) => {
  if (!boardId) throw new Error("Unauthorized: Board Id is required");

  const board = await boardModel.findByPk(boardId);
  if (!board) throw new Error("Board not found");

  const transaction = await listModel.sequelize.transaction();
  try {
    const maxPosition = await listModel.max("position", {
      where: { board_id: boardId },
      transaction,
    });

    const newList = await listModel.create(
      {
        board_id: boardId,
        name,
        position: (maxPosition || 0) + 1,
      },
      { transaction }
    );

    await transaction.commit();

    return newList;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

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

const getListById = async (listId) => {
  if (!listId) throw new Error("Unauthorized: List Id is required");

  const dataList = await listModel.findByPk(listId, {
    include: [{ model: boardModel, as: "board" }],
  });
  if (!dataList) throw new Error("List not found");

  return {
    list: dataList,
  };
};

const updateList = async (listId, name) => {
  if (!listId) throw new Error("Unauthorized: List Id is required");

  const dataList = await listModel.findByPk(listId);
  if (!dataList) throw new Error("List not found");

  const [_, newList] = await listModel.update(
    { name },
    { where: { id: listId }, returning: true }
  );

  return newList[0];
};

const updateListPosition = async (listId, newPosition) => {
  if (!listId) throw new Error("Unauthorized: List Id is required");

  const list = await listModel.findByPk(listId);
  if (!list) throw new Error("List not found");

  const boardId = list.board_id;

  const lists = await listModel.findAll({
    where: { board_id: boardId },
    order: [["position", "ASC"]],
  });

  if (newPosition < 1 || newPosition > lists.length) {
    throw new Error("Invalid position");
  }

  const oldIndex = lists.findIndex((l) => l.id === listId);
  const [movedList] = lists.splice(oldIndex, 1);

  lists.splice(newPosition - 1, 0, movedList);

  const updatePromises = lists.map((l, index) =>
    listModel.update({ position: index + 1 }, { where: { id: l.id } })
  );

  await Promise.all(updatePromises);

  return lists;
};

const deleteList = async (listId) => {
  if (!listId) throw new Error("Unauthorized: List Id is required");

  const list = await listModel.findByPk(listId);
  if (!list) throw new Error("List not found");

  const boardId = list.board_id;
  const deletedPosition = list.position;

  await list.destroy();

  const listsToUpdate = await listModel.findAll({
    where: {
      board_id: boardId,
      position: { [Op.gt]: deletedPosition },
    },
    order: [["position", "ASC"]],
  });

  const updatePromises = listsToUpdate.map((l) =>
    listModel.update({ position: l.position - 1 }, { where: { id: l.id } })
  );

  await Promise.all(updatePromises);

  return { message: "List deleted successfully" };
};

module.exports = {
  createList,
  getLists,
  getListById,
  updateList,
  updateListPosition,
  deleteList,
};