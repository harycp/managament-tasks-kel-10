const workspaceModel = require("../models/workspace");
const workspaceMemberModel = require("../models/workspaceMembers");
const workspaceEventProducer = require("../kafka/producers/workspaceEventProducer");
const { Op } = require("sequelize");

const createWorkspace = async (workspaceData, userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.create({
    name: workspaceData.name,
    type: workspaceData.type,
    description: workspaceData.description,
    owner_id: userId,
  });

  await workspaceEventProducer.sendWorkspaceCreatedEvent({
    workspaceId: workspace.id,
    workspaceName: workspaceData.name,
    ownerId: userId,
  });

  return workspace;
};

const createDefaultWorkspace = async (userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.create({
    name: `Personal Workspace`,
    type: "personal",
    description: "Personal Workspace",
    owner_id: userId,
  });

  await workspaceEventProducer.sendWorkspaceCreatedEvent({
    workspaceId: workspace.id,
    workspaceName: "Personal",
    ownerId: userId,
  });

  return workspace;
};

const getWorkspaces = async (userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspaces = await workspaceModel.findAll({
    where: { owner_id: userId },
  });

  return workspaces;
};

const getWorkspaceById = async (workspaceID, userId) => {
  if (!userId) throw new Error("Unauthorized: User Id is required");

  const workspace = await workspaceModel.findOne({
    where: { id: workspaceID, owner_id: userId },
  });

  return workspace;
};

const updateWorkspace = async (workspaceID, userID, workspaceData) => {
  if (!userID) throw new Error("Unauthorized: User Id is required");

  const { name, type, description } = workspaceData;

  const workspace = await workspaceModel.findOne({
    where: { id: workspaceID, owner_id: userID },
  });

  if (!workspace) throw new Error("Workspace not found");

  return workspace.update({ name, type, description });
};

const deleteWorkspace = async (workspaceID, userID) => {
  if (!userID) throw new Error("Unauthorized: User Id is required");
  const workspaceMember = await workspaceMemberModel.findOne({
    where: { workspace_id: workspaceID, user_id: userID },
  });

  if (!workspaceMember) throw new Error("Workspace not found");
  workspaceMember.destroy();

  const workspace = await workspaceModel.findOne({
    where: { id: workspaceID, owner_id: userID },
  });

  if (!workspace) throw new Error("Workspace not found");

  await workspaceEventProducer.sendWorkspaceDeletedEvent({
    workspaceId: workspace.id,
  });

  return workspace.destroy();
};

const getWorkspacesForUser = async (userId) => {
  const memberships = await workspaceMemberModel.findAll({
    where: { user_id: userId },
    attributes: ["workspace_id", "role"],
    raw: true,
  });

  console.log(memberships);

  if (memberships.length === 0) {
    return [];
  }

  const roleMap = new Map(memberships.map((m) => [m.workspace_id, m.role]));
  const workspaceIds = memberships.map((m) => m.workspace_id);

  const workspaces = await workspaceModel.findAll({
    where: {
      id: { [Op.in]: workspaceIds },
    },
  });

  const hydratedWorkspaces = workspaces.map((ws) => {
    const workspaceJson = ws.toJSON();
    workspaceJson.user_role = roleMap.get(ws.id);
    return workspaceJson;
  });

  return hydratedWorkspaces;
};

module.exports = {
  createWorkspace,
  createDefaultWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspacesForUser,
};
