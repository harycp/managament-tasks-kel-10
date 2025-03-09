const workspaceMemberService = require("../services/workspaceMemberService");

const createWorkspaceMember = async (req, res) => {
  try {
    const workspaceMemberData = req.body;
    const workspaceMember = await workspaceMemberService.createWorkspaceMember(
      workspaceMemberData
    );

    res
      .status(201)
      .json({ message: "Workspace member created", data: workspaceMember });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWorkspaceMembers = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaceMembers = await workspaceMemberService.getWorkspaceMembers(
      userId
    );
    res
      .status(200)
      .json({ message: "Workspace members retrieved", data: workspaceMembers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWorkspaceMemberById = async (req, res) => {
  try {
    const userId = req.user.id;
    const workspaceMemberId = req.params.id;
    const workspaceMembers =
      await workspaceMemberService.getWorkspaceMemberById(
        workspaceMemberId,
        userId
      );
    res
      .status(200)
      .json({ message: "Workspace members retrieved", data: workspaceMembers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createWorkspaceMember,
  getWorkspaceMembers,
  getWorkspaceMemberById,
};
