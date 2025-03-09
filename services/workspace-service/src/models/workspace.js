const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const user = require("../../../user-service/src/models/user");

const workspaceMember = require("./workspaceMembers");

const workspace = sequelize.define(
  "workspace",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

workspace.afterCreate(async (workspace, option) => {
  await workspaceMember.create({
    workspace_id: workspace.id,
    user_id: workspace.owner_id,
    role: "owner",
  });
});

module.exports = workspace;
