const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const board = sequelize.define(
  "board",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    workspace_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "workspaces",
        key: "id",
      },
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    assignee_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM,
      values: ["public", "private", "workspace"],
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = board;
