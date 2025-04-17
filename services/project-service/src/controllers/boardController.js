const boardService = require("../services/boardService");

// Fungsi untuk membuat board baru dalam workspace tertentu
const createBoard = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const name = req.body.name;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Panggil service untuk membuat board
    const board = await boardService.createBoard(workspaceId, name, token);

    res.status(201).json({ message: "Board created", data: board });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fungsi untuk mengambil semua board dalam satu workspace
const getBoards = async (req, res) => {
  try {
    const workspaceId = req.params.id;

    const token = req.cookies.authToken; // Ambil token dari cookie

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Ambil semua board dari service
    const boards = await boardService.getBoards(workspaceId, token);

    res.status(200).json({ message: "Boards retrieved", data: boards });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Fungsi untuk mengambil satu board berdasarkan ID
const getBoardById = async (req, res) => {
  try {
    const boardId = req.params.id;

    const board = await boardService.getBoardById(boardId);

    res.status(200).json({ message: "Board retrieved", data: board });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fungsi untuk mengupdate nama board
const updateBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const name = req.body.name;

    const board = await boardService.updateBoard(boardId, name);

    res.status(200).json({ message: "Board updated", data: board });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fungsi untuk menghapus board berdasarkan ID
const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    
    // Hapus board menggunakan service
    await boardService.deleteBoard(boardId);

    res.status(200).json({ message: "Board deleted", data: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};
