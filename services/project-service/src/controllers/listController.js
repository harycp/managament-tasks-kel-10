const e = require("express");
const listService = require("../services/listService");

// Fungsi untuk membuat list baru di dalam board tertentu
const createList = async (req, res) => {
  try {
    const boardId = req.params.id;
    const name = req.body.name;

    // Buat list baru melalui service
    const list = await listService.createList(boardId, name);

    res.status(201).json({ message: "List created", data: list });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Fungsi untuk mengambil semua list di dalam board tertentu
const getLists = async (req, res) => {
  try {
    const boardId = req.params.id;

    // Ambil semua list yang ada pada board
    const list = await listService.getLists(boardId);

    res.status(200).json({ message: "Lists retrieved", data: list });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fungsi untuk mengambil satu list berdasarkan ID
const getListById = async (req, res) => {
  try {
    const listId = req.params.id;

    const list = await listService.getListById(listId);

    res.status(200).json({ message: "List retrieved", data: list });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fungsi untuk mengubah nama list
const updateList = async (req, res) => {
  try {
    const listId = req.params.id;
    const name = req.body.name;

    const list = await listService.updateList(listId, name);

    res.status(200).json({ message: "List updated", data: list });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fungsi untuk mengubah posisi list (misalnya drag & drop)
const updateListPosition = async (req, res) => {
  try {
    const listId = req.params.id;
    const { newPosition } = req.body;

    if (!newPosition) {
      return res.status(400).json({ error: "New position is required" });
    }

    // Update posisi list di board
    const updatedLists = await listService.updateListPosition(
      listId,
      newPosition
    );

    res
      .status(200)
      .json({ message: "List position updated", data: updatedLists });
  } catch (error) {
    console.log("TYess"); // Log ini bisa dihapus jika tidak dipakai
    res.status(400).json({ error: error.message });
  }
};

// Fungsi untuk menghapus list
const deleteList = async (req, res) => {
  try {
    const listId = req.params.id;

    // Hapus list berdasarkan ID
    const list = await listService.deleteList(listId);

    res.status(200).json({ message: "List deleted", data: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createList,
  getLists,
  getListById,
  updateList,
  updateListPosition,
  deleteList,
};
