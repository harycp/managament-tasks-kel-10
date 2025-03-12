const sequelize = require("../database");

const board = require("./board");
const list = require("./list");

board.hasMany(list, {
  foreignKey: "board_id",
  as: "lists",
});

list.belongsTo(board, {
  foreignKey: "board_id",
  as: "board",
});

const db = { sequelize, board, list };
module.exports = db;
