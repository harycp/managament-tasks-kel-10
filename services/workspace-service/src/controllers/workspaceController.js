const workspaceService = require("../services/workspaceService");

const createWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaceData = req.body;

    const workspace = await workspaceService.createWorkspace(
      workspaceData,
      userId
    );
    res.status(201).json({ message: "Workspace created", data: workspace });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaces = await workspaceService.getWorkspaces(userId);

    res.status(200).json({ message: "Workspaces retrieved", data: workspaces });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaceId = req.params.id;
    const workspace = await workspaceService.getWorkspaceById(
      workspaceId,
      userId
    );

    res.status(200).json({ message: "Workspace retrieved", data: workspace });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaceId = req.params.id;
    const workspaceData = req.body;

    const workspace = await workspaceService.updateWorkspace(
      workspaceId,
      userId,
      workspaceData
    );

    res.status(200).json({ message: "Workspace updated", data: workspace });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaceId = req.params.id;

    await workspaceService.deleteWorkspace(workspaceId, userId);

    res.status(200).json({ message: "Workspace deleted", data: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
