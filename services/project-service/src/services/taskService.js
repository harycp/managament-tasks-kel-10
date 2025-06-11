const taskModel = require("../models/task");
const { sequelize } = require("../models");
const { Op } = require("sequelize");

const createTask = async (listId, taskData) => {
  const taskCount = await taskModel.count({
    where: {
      list_id: listId,
    },
  });
  const position = taskCount + 1;

  const newTask = await taskModel.create({
    ...taskData,
    list_id: listId,
    position,
  });

  return newTask;
};

const updateTask = async (taskId, updateData) => {
  const task = await taskModel.findByPk(taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  await task.update(updateData);

  return task;
};

const updateTaskPosition = async (taskId, newPosition) => {
  const t = await sequelize.transaction();
  try {
    const taskToMove = await taskModel.findByPk(taskId, { transaction: t });
    if (!taskToMove) throw new Error("Task not found");

    const oldPosition = taskToMove.position;
    const listId = taskToMove.list_id;

    if (oldPosition === newPosition) {
      await t.commit();
      return;
    }

    if (oldPosition < newPosition) {
      await taskModel.update(
        { position: sequelize.literal("position - 1") },
        {
          where: {
            list_id: listId,
            position: { [Op.gt]: oldPosition, [Op.lte]: newPosition },
          },
          transaction: t,
        }
      );
    } else {
      await taskModel.update(
        { position: sequelize.literal("position + 1") },
        {
          where: {
            list_id: listId,
            position: { [Op.gte]: newPosition, [Op.lt]: oldPosition },
          },
          transaction: t,
        }
      );
    }

    await taskToMove.update({ position: newPosition }, { transaction: t });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = { createTask, updateTask, updateTaskPosition };
