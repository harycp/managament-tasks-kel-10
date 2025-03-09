const workspaceService = require("../services/workspaceService");

const createWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaceData = req.body;

    const workspace = await workspaceService.createWorkspace(
      workspaceData,
      userId
    );
    res.status(201).json({ message: "Workspace created", workspace });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createWorkspace };
