const sequelize = require("../database");

const workspace = require("./workspace");
const workspaceMember = require("./workspaceMembers");

const db = { sequelize, workspace, workspaceMember };
module.exports = db;
