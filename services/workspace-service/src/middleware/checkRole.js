const workspaceModel = require("../models/workspace");
const workspaceMemberModel = require("../models/workspaceMembers");

const checkRole = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const ownedWorkspaces = await workspaceModel.findAll({
      where: { owner_id: userId },
    });

    if (ownedWorkspaces.length > 0) {
      return next();
    }

    const isAdmin = await workspaceMemberModel.findOne({
      where: { user_id: userId, role: "admin" },
    });

    if (!isAdmin)
      throw new Error(
        "Unauthorized: User does not have permission to perform this action"
      );

    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = checkRole;
