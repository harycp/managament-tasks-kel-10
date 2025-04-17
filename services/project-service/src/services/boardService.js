const boardModel = require("../models/board"); // Mengimpor model board dari folder models
const { getWorkspaceById } = require("./workspaceService"); // Mengimpor fungsi getWorkspaceById dari service workspace

// Fungsi untuk membuat board baru pada workspace tertentu
const createBoard = async (workspaceId, name, token) => {
  // Mendapatkan data workspace berdasarkan ID dan token
  const workspace = await getWorkspaceById(workspaceId, token);
  if (!workspace) throw new Error("Workspace not found"); // Jika workspace tidak ditemukan, lempar error

  // Membuat board baru yang terhubung dengan workspace
  const board = await boardModel.create({
    workspace_id: workspace.data.id,
    name,
  });

  return board; // Mengembalikan data board yang telah dibuat
};

// Fungsi untuk mengambil semua board yang ada dalam satu workspace
const getBoards = async (workspaceId, token) => {
  // Mendapatkan data workspace berdasarkan ID dan token
  const workspace = await getWorkspaceById(workspaceId, token);
  if (!workspace) throw new Error("Workspace not found"); // Jika workspace tidak ditemukan, lempar error

  // Mencari semua board yang memiliki workspace_id sesuai
  const boards = await boardModel.findAll({
    where: {
      workspace_id: workspace.data.id,
    },
  });

  return boards; // Mengembalikan daftar board
};

// Fungsi untuk mengambil satu board berdasarkan ID-nya
const getBoardById = async (boardId) => {
  // Mencari board berdasarkan primary key (ID)
  const board = await boardModel.findByPk(boardId);
  return board; // Mengembalikan data board (bisa null jika tidak ditemukan)
};

// Fungsi untuk memperbarui nama board berdasarkan ID
const updateBoard = async (boardId, name) => {
  // Mencari board berdasarkan ID
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found"); // Jika board tidak ditemukan, lempar error
  if (board.name === name) return board; // Jika nama tidak berubah, kembalikan board tanpa update

  return board.update({ name }); // Jika nama berubah, lakukan update dan kembalikan hasilnya
};

// Fungsi untuk menghapus board berdasarkan ID
const deleteBoard = async (boardId) => {
  // Mencari board berdasarkan ID
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found"); // Jika board tidak ditemukan, lempar error

  return board.destroy(); // Menghapus board dari database
};

// Mengekspor semua fungsi agar bisa digunakan di file lain
module.exports = {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};

