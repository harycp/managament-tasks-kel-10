const sequelize = require("../database");
const User = require("./user");
const userRole = require("./userRoles");
const permission = require("./permissions");

const rolePermission = require("./rolePermission");
const userRoleAssignment = require("./useRoleAssignments");

userRole.belongsToMany(permission, {
  through: rolePermission,
  foreignKey: "role_id",
});

permission.belongsToMany(userRole, {
  through: rolePermission,
  foreignKey: "permission_id",
});

userRole.belongsToMany(User, {
  through: userRoleAssignment,
  foreignKey: "role_id",
});

User.belongsToMany(userRole, {
  through: userRoleAssignment,
  foreignKey: "user_id",
});

const db = { sequelize, User, userRole, permission };
module.exports = db;
