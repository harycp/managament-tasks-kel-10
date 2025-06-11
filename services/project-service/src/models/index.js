const sequelize = require("../database");

const board = require("./board");
const list = require("./list");
const task = require("./task");

board.hasMany(list, {
  foreignKey: "board_id",
  as: "lists",
});

list.belongsTo(board, {
  foreignKey: "board_id",
  as: "board",
});

list.hasMany(task, {
  foreignKey: "list_id",
  as: "tasks",
  onDelete: "CASCADE",
});

task.belongsTo(list, {
  foreignKey: "list_id",
  as: "list",
});

const db = { sequelize, board, list, task };
module.exports = db;
