const workspaceMemberModel = require("../models/workspaceMembers");

const checkRole = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const workspaceId = req.params.workspaceId || req.body.workspace_id;

    const workspaceMember = await workspaceMemberModel.findOne({
      where: { user_id: userId, workspace_id: workspaceId },
    });

    if (!workspaceMember)
      throw new Error("Unauthorized: User is not a member of the workspace");

    if (workspaceMember.role !== "owner" && workspaceMember.role !== "admin")
      throw new Error(
        "Unauthorized: User does not have permission to perform this action"
      );

    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = checkRole;
