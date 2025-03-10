const sequelize = require("../database");

const workspace = require("./workspace");
const workspaceMember = require("./workspaceMembers");

workspace.hasMany(workspaceMember, {
  foreignKey: "workspace_id",
  as: "members",
});

workspaceMember.belongsTo(workspace, {
  foreignKey: "workspace_id",
  as: "workspace",
});

const db = { sequelize, workspace, workspaceMember };
module.exports = db;
