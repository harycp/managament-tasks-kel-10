const { Op, Sequelize } = require("sequelize"); // Mengimpor operator dan Sequelize instance
const listModel = require("../models/list"); // Mengimpor model list
const boardModel = require("../models/board"); // Mengimpor model board

// Fungsi untuk membuat list baru dalam board tertentu
const createList = async (boardId, name) => {
  if (!boardId) throw new Error("Unauthorized: Board Id is required"); // Validasi boardId

  // Cari board berdasarkan ID
  const board = await boardModel.findByPk(boardId);
  if (!board) throw new Error("Board not found");

  // Memulai transaksi untuk memastikan data konsisten
  const transaction = await listModel.sequelize.transaction();
  try {
    // Ambil posisi tertinggi saat ini pada board tersebut
    const maxPosition = await listModel.max("position", {
      where: { board_id: boardId },
      transaction,
    });

    // Buat list baru dengan posisi +1 dari posisi maksimum
    const newList = await listModel.create(
      {
        board_id: boardId,
        name,
        position: (maxPosition || 0) + 1,
      },
      { transaction }
    );

    await transaction.commit(); // Commit transaksi jika berhasil

    return newList;
  } catch (error) {
    await transaction.rollback(); // Rollback jika gagal
    throw error;
  }
};

// Fungsi untuk mengambil semua list dalam satu board
const getLists = async (boardId) => {
  if (!boardId) throw new Error("Unauthorized: Board Id is required");

  // Ambil board beserta relasi list-nya
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

// Fungsi untuk mengambil detail list berdasarkan ID-nya
const getListById = async (listId) => {
  if (!listId) throw new Error("Unauthorized: List Id is required");

  // Cari list berdasarkan ID dan sertakan data board-nya
  const dataList = await listModel.findByPk(listId, {
    include: [{ model: boardModel, as: "board" }],
  });
  if (!dataList) throw new Error("List not found");

  return {
    list: dataList,
  };
};

// Fungsi untuk mengubah nama list
const updateList = async (listId, name) => {
  if (!listId) throw new Error("Unauthorized: List Id is required");

  const dataList = await listModel.findByPk(listId);
  if (!dataList) throw new Error("List not found");

  // Update nama list dan kembalikan data terbaru
  const [_, newList] = await listModel.update(
    { name },
    { where: { id: listId }, returning: true }
  );

  return newList[0];
};

// Fungsi untuk mengubah posisi list dalam satu board
const updateListPosition = async (listId, newPosition) => {
  if (!listId) throw new Error("Unauthorized: List Id is required");

  // Cari list berdasarkan ID
  const list = await listModel.findByPk(listId);
  if (!list) throw new Error("List not found");

  const boardId = list.board_id;

  // Ambil semua list dalam board dan urutkan berdasarkan posisi
  const lists = await listModel.findAll({
    where: { board_id: boardId },
    order: [["position", "ASC"]],
  });

  // Validasi posisi baru
  if (newPosition < 1 || newPosition > lists.length) {
    throw new Error("Invalid position");
  }

  // Pindahkan posisi list
  const oldIndex = lists.findIndex((l) => l.id === listId);
  const [movedList] = lists.splice(oldIndex, 1); // Hapus dari posisi lama
  lists.splice(newPosition - 1, 0, movedList); // Sisipkan ke posisi baru

  // Update posisi semua list sesuai urutan baru
  const updatePromises = lists.map((l, index) =>
    listModel.update({ position: index + 1 }, { where: { id: l.id } })
  );

  await Promise.all(updatePromises); // Jalankan semua update secara paralel

  return lists; // Kembalikan urutan list terbaru
};

// Fungsi untuk menghapus list dan menyesuaikan posisi list lainnya
const deleteList = async (listId) => {
  if (!listId) throw new Error("Unauthorized: List Id is required");

  const list = await listModel.findByPk(listId);
  if (!list) throw new Error("List not found");

  const boardId = list.board_id;
  const deletedPosition = list.position;

  await list.destroy(); // Hapus list dari database

  // Cari semua list yang berada setelah posisi list yang dihapus
  const listsToUpdate = await listModel.findAll({
    where: {
      board_id: boardId,
      position: { [Op.gt]: deletedPosition },
    },
    order: [["position", "ASC"]],
  });

  // Geser posisi mereka ke atas (posisi - 1)
  const updatePromises = listsToUpdate.map((l) =>
    listModel.update({ position: l.position - 1 }, { where: { id: l.id } })
  );

  await Promise.all(updatePromises); // Update posisi secara paralel

  return { message: "List deleted successfully" };
};

// Mengekspor semua fungsi agar bisa digunakan di file lain
module.exports = {
  createList,
  getLists,
  getListById,
  updateList,
  updateListPosition,
  deleteList,
};
