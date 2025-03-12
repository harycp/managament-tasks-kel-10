const { Op, Sequelize } = require("sequelize");

const listModel = require("../models/list");
const boardModel = require("../models/board");

const createList = async (boardId, name) => {
  if (!boardId) throw new Error("Unauthorized: Board Id is required");

  // Cek apakah board tersedia
  const board = await boardModel.findByPk(boardId);
  if (!board) throw new Error("Board not found");

  // Gunakan transaksi untuk menjaga konsistensi data
  const transaction = await listModel.sequelize.transaction();
  try {
    // Ambil posisi tertinggi saat ini
    const maxPosition = await listModel.max("position", {
      where: { board_id: boardId },
      transaction,
    });

    // Buat list baru dengan posisi setelah yang terakhir
    const newList = await listModel.create(
      {
        board_id: boardId,
        name,
        position: (maxPosition || 0) + 1, // Jika tidak ada list, mulai dari 1
      },
      { transaction }
    );

    // Commit transaksi
    await transaction.commit();

    return newList;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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

  // Hapus list dari posisi awal
  const oldIndex = lists.findIndex((l) => l.id === listId);
  const [movedList] = lists.splice(oldIndex, 1);

  // Masukkan list ke posisi baru
  lists.splice(newPosition - 1, 0, movedList);

  // Update semua list sesuai urutan baru
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
