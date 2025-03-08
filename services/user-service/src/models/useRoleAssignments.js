const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");
const UserRole = require("./userRoles");

const UserRoleAssignment = sequelize.define(
  "userRoleAssignment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserRole,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserRoleAssignment;
