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

module.exports = { createWorkspaceMember };
