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

module.exports = { createWorkspace, getWorkspaces };
