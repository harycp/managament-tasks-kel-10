const boardModel = require("../models/board"); 
const { getWorkspaceById } = require("./workspaceService"); 

// Fungsi untuk membuat board baru pada workspace tertentu
const createBoard = async (workspaceId, name, token) => {
  // Mendapatkan data workspace berdasarkan ID dan token
  const workspace = await getWorkspaceById(workspaceId, token);
  if (!workspace) throw new Error("Workspace not found"); 

  // Membuat board baru yang terhubung dengan workspace
  const board = await boardModel.create({
    workspace_id: workspace.data.id,
    name,
  });

  return board; =
};

// Fungsi untuk mengambil semua board yang ada dalam satu workspace
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
const getBoardById = async (boardId) => {
  // Mencari board berdasarkan primary key (ID)
  const board = await boardModel.findByPk(boardId);
  return board; 
};

// Fungsi untuk memperbarui nama board berdasarkan ID
const updateBoard = async (boardId, name) => {
  // Mencari board berdasarkan ID
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found"); 
  if (board.name === name) return board;

  return board.update({ name }); 
};

// Fungsi untuk menghapus board berdasarkan ID
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

