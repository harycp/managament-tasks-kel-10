const e = require("express");
const listService = require("../services/listService");

const createList = async (req, res) => {
  try {
    const boardId = req.params.id;
    const name = req.body.name;

    const list = await listService.createList(boardId, name);

    res.status(201).json({ message: "List created", data: list });
  } catch (e) {
    // console.log(e.message);
    res.status(400).json({ error: e.message });
  }
};

const getLists = async (req, res) => {
  try {
    const boardId = req.params.id;
    const list = await listService.getLists(boardId);

    res.status(200).json({ message: "Lists retrieved", data: list });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getListById = async (req, res) => {
  try {
    const listId = req.params.id;
    const list = await listService.getListById(listId);

    res.status(200).json({ message: "List retrieved", data: list });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

const updateListPosition = async (req, res) => {
  try {
    const listId = req.params.id;
    const { newPosition } = req.body;

    if (!newPosition) {
      return res.status(400).json({ error: "New position is required" });
    }

    const updatedLists = await listService.updateListPosition(
      listId,
      newPosition
    );

    res
      .status(200)
      .json({ message: "List position updated", data: updatedLists });
  } catch (error) {
    console.log("TYess");
    res.status(400).json({ error: error.message });
  }
};

const deleteList = async (req, res) => {
  try {
    const listId = req.params.id;
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
