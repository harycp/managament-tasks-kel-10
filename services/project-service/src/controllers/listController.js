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

module.exports = { createList };
