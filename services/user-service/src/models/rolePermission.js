const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const UserRole = require("./userRoles");
const Permission = require("./permissions");

const RolePermission = sequelize.define(
  "rolePermission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserRole,
        key: "id",
      },
    },
    permission_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Permission,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = RolePermission;
