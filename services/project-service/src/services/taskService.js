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

module.exports = { createTask };
