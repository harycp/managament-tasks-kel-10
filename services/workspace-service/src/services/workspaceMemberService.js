const workspaceMemberModel = require("../models/workspaceMembers");
const workspaceModel = require("../models/workspace");

const userModel = require("../../../user-service/src/models/user");

const userRole = require("../../../user-service/src/models/userRoles");

const createWorkspaceMember = async (workspaceMemberData) => {
  const { workspace_id, user_id, role } = workspaceMemberData;

  const user = await userModel.findByPk(user_id);
  if (!user) throw new Error("User not found");

  const workspace = await workspaceModel.findByPk(workspace_id);
  if (!workspace) throw new Error("Workspace not found");

  const workspaceMemberAlready = await workspaceMemberModel.findOne({
    where: { workspace_id, user_id },
  });

  if (workspaceMemberAlready) throw new Error("User already in workspace");

  const isRoleExist = userRole.findOne({ where: { name: role } });
  if (!isRoleExist) throw new Error("Role not found");

  const workspaceMember = await workspaceMemberModel.create({
    ...workspaceMemberData,
  });

  return workspaceMember;
};

module.exports = { createWorkspaceMember };
