const sequelize = require("../database");

const board = require("./board");
const workspace = require("../../../workspace-service/src/models/workspace");

const db = { sequelize, workspace };
module.exports = db;
