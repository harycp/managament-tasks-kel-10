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
    type: {
      type: DataTypes.ENUM,
      values: [
        "engineering_it",
        "human_resources",
        "marketting",
        "sales_crm",
        "operation",
        "small_business",
        "education",
        "student_organization",
        "personal",
        "other",
      ],
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
