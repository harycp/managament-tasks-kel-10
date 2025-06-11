const taskService = require("../services/taskService");

const createTask = async (req, res) => {
  try {
    const { listId } = req.params;
    const { name } = req.body;
    const task = await taskService.createTask(listId, { name });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { name, description, due_date, completed, assignee_id } = req.body;
    const updateData = { name, description, due_date, completed, assignee_id };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const task = await taskService.updateTask(taskId, updateData);
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTaskPosition = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newPosition } = req.body;
    await taskService.updateTaskPosition(taskId, newPosition);
    res.status(200).json({ success: true, message: "Task position updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  updateTaskPosition,
};
