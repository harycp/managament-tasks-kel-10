const boardService = require("../services/boardService");

const createBoard = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const name = req.body.name;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const board = await boardService.createBoard(workspaceId, name, token);

    res.status(201).json({ message: "Board created", data: board });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBoards = async (req, res) => {
  try {
    const workspaceId = req.params.id;

    // console.log(req.cookies);
    const token = req.cookies.authToken;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const boards = await boardService.getBoards(workspaceId, token);

    res.status(200).json({ message: "Boards retrieved", data: boards });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const getBoardById = async (req, res) => {
  try {
    const boardId = req.params.id;

    const board = await boardService.getBoardById(boardId);

    res.status(200).json({ message: "Board retrieved", data: board });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
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
