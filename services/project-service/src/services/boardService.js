const boardModel = require("../models/board");
const { getWorkspaceById } = require("./workspaceService");

/**
 * Module untuk mengelola data board.
 * @module boardService
 */

// Fungsi untuk membuat board baru pada workspace tertentu

/**
 * Membuat board baru di dalam workspace yang ditentukan
 * @async
 * @function createBoard
 * @param {number|string} workspaceId - ID workspace yang akan di-assign
 * @param {string} name - Nama board yang akan dibuat
 * @param {string} token - Token untuk verifikasi otoritas
 * @returns {Promise<Model>} Board yang baru dibuat
 * @throws {Error} Jika workspace tidak ditemukan
 * @example
 * const newBoard = await createBoard(1, 'Project X', 'token');
 */
const createBoard = async (workspaceId, name, token) => {
  // Mendapatkan data workspace berdasarkan ID dan token
  const workspace = await getWorkspaceById(workspaceId, token);
  if (!workspace) throw new Error("Workspace not found");

  // Membuat board baru yang terhubung dengan workspace
  const board = await boardModel.create({
    workspace_id: workspace.data.id,
    name,
  });

  return board;
};

// Fungsi untuk mengambil semua board yang ada dalam satu workspace

/**
 * Mengambil semua board yang ada dalam satu workspace
 * @async
 * @function getBoards
 * @param {number|string} workspaceId - ID workspace yang akan di-assign
 * @param {string} token - Token untuk verifikasi otoritas
 * @returns {Promise<Model[]>} Array dari semua board yang ada di workspace
 * @throws {Error} Jika workspace tidak ditemukan
 * @example
 * const boards = await getBoards(1, 'token');
 */
const getBoards = async (workspaceId, token) => {
  // Mendapatkan data workspace berdasarkan ID dan token
  const workspace = await getWorkspaceById(workspaceId, token);
  if (!workspace) throw new Error("Workspace not found");

  // Mencari semua board yang memiliki workspace_id sesuai
  const boards = await boardModel.findAll({
    where: {
      workspace_id: workspace.data.id,
    },
  });

  return boards;
};

// Fungsi untuk mengambil satu board berdasarkan ID-nya

/**
 * Mengambil satu board berdasarkan ID-nya
 * @async
 * @function getBoardById
 * @param {number|string} boardId - ID board yang akan diambil
 * @returns {Promise<Model|null>} Board yang ditemukan, atau null jika tidak ada
 * @throws {Error} Jika board tidak ditemukan
 * @example
 * const board = await getBoardById(1);
 * console.log(board);
 */

const getBoardById = async (boardId) => {
  // Mencari board berdasarkan primary key (ID)
  const board = await boardModel.findByPk(boardId);
  return board;
};

// Fungsi untuk memperbarui nama board berdasarkan ID

/**
 * Memperbarui nama board berdasarkan ID-nya
 * @async
 * @function updateBoard
 * @param {number|string} boardId - ID board yang akan diperbarui
 * @param {string} name - Nama baru untuk board
 * @returns {Promise<Model>} Board yang telah diperbarui
 * @throws {Error} Jika board tidak ditemukan
 * @example
 * const updatedBoard = await updateBoard(1, 'New Board Name');
 */

const updateBoard = async (boardId, name) => {
  // Mencari board berdasarkan ID
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found");
  if (board.name === name) return board;

  return board.update({ name });
};

// Fungsi untuk menghapus board berdasarkan ID

/**
 * Menghapus board berdasarkan ID.
 * @async
 * @function deleteBoard
 * @param {number|string} boardId - ID board yang akan dihapus
 * @returns {Promise<Model|null>} Board yang dihapus, atau null jika board tidak ditemukan
 * @throws {Error} Jika board tidak ditemukan
 * @example
 * const deletedBoard = await deleteBoard(1);
 * console.log(deletedBoard);
 */
const deleteBoard = async (boardId) => {
  // Mencari board berdasarkan ID
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found");

  return board.destroy();
};

// Mengekspor semua fungsi agar bisa digunakan di file lain
module.exports = {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};
