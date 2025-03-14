const workspaceMemberModel = require("../models/workspaceMembers");
const workspaceModel = require("../models/workspace");

const userModel = require("../../../user-service/src/models/user");

const userRole = require("../../../user-service/src/models/userRoles");

const createWorkspaceMember = async (workspaceMemberData) => {
  const { workspace_id, email, role } = workspaceMemberData;

  const user = await userModel.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const user_id = user.id;

  const workspace = await workspaceModel.findByPk(workspace_id);
  if (!workspace) throw new Error("Workspace not found");

  const workspaceMemberAlready = await workspaceMemberModel.findOne({
    where: { workspace_id, user_id },
  });

  if (workspaceMemberAlready) throw new Error("User already in workspace");

  const isRoleExist = userRole.findOne({ where: { name: role } });
  if (!isRoleExist) throw new Error("Role not found");

  const workspaceMember = await workspaceMemberModel.create({
    workspace_id,
    user_id,
    role,
  });

  return workspaceMember;
};

const getWorkspaceMembers = async (userID) => {
  if (!userID) throw new Error("Unauthorized: User Id is required");

  const workspaces = await workspaceModel.findAll({
    where: { owner_id: userID },
    include: [{ model: workspaceMemberModel, as: "members" }],
  });

  if (!workspaces.length) throw new Error("No workspaces found for this user");

  return workspaces.map((workspace) => ({
    workspace: {
      id: workspace.id,
      name: workspace.name,
    },
    members: workspace.members.map((member) => ({
      id: member.id,
      user_id: member.user_id,
      role: member.role,
    })),
  }));
};

const getWorkspaceMemberById = async (workspaceMemberId, userID) => {
  if (!userID) throw new Error("Unauthorized: User ID is required");

  const workspaceMember = await workspaceMemberModel.findByPk(
    workspaceMemberId,
    {
      include: [{ model: workspaceModel, as: "workspace" }],
    }
  );

  if (!workspaceMember) throw new Error("Workspace member not found");

  if (!workspaceMember.workspace) {
    throw new Error("Workspace not found for this member");
  }

  if (workspaceMember.workspace.owner_id !== userID) {
    throw new Error("Unauthorized: You do not have access");
  }

  return {
    id: workspaceMember.id,
    user_id: workspaceMember.user_id,
    role: workspaceMember.role,
    workspace: {
      id: workspaceMember.workspace.id,
      name: workspaceMember.workspace.name,
    },
  };
};

const updateWorkspaceMember = async (workspaceMemberData) => {
  const { id, workspace_id, user_id, role } = workspaceMemberData;

  const workspaceMember = await workspaceMemberModel.findByPk(id);
  if (!workspaceMember) throw new Error("Workspace member not found");

  const user = await userModel.findByPk(user_id);
  if (!user) throw new Error("User not found");

  const workspace = await workspaceModel.findByPk(workspace_id);
  if (!workspace) throw new Error("Workspace not found");

  if (workspaceMember.user_id !== user_id) {
    const workspaceMemberAlready = await workspaceMemberModel.findOne({
      where: { workspace_id, user_id },
    });

    if (workspaceMemberAlready) throw new Error("User already in workspace");
  }

  const isRoleExist = await userRole.findOne({ where: { name: role } });
  if (!isRoleExist) throw new Error("Role not found");

  const [_, updatedMembers] = await workspaceMemberModel.update(
    { role },
    { where: { id }, returning: true }
  );

  return updatedMembers[0];
};

const deleteWorkspaceMember = async (workspaceMemberId) => {
  const workspaceMember = await workspaceMemberModel.findByPk(
    workspaceMemberId
  );
  if (!workspaceMember) throw new Error("Workspace member not found");

  return await workspaceMember.destroy();
};

module.exports = {
  createWorkspaceMember,
  getWorkspaceMembers,
  getWorkspaceMemberById,
  updateWorkspaceMember,
  deleteWorkspaceMember,
};
