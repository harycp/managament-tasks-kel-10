const sequelize = require("../database");

const board = require("./board");
const list = require("./list");
const task = require("./task");
const boardMember = require("./boardMember");

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

board.hasMany(boardMember, {
  foreignKey: "board_id",
  as: "members",
});

boardMember.belongsTo(board, {
  foreignKey: "board_id",
  as: "board",
});

const db = { sequelize, board, list, task, boardMember };
module.exports = db;
