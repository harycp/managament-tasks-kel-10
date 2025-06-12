const board = require("../models/board");
const boardModel = require("../models/board");
const listModel = require("../models/list");
const taskModel = require("../models/task");
const boardMemberModel = require("../models/boardMember");
const { getWorkspaceById } = require("./workspaceService");

const boardEventProducer = require("../kafka/producers/boardEventProducer");

const { userResponse, findUserByEmail } = require("./userService");
const { Op } = require("sequelize");

/**
 * Module untuk mengelola data board.
 * @module boardService
 */

// Fungsi untuk membuat board baru pada workspace tertentu

/**
 * Membuat board baru di dalam workspace yang ditentukan
 * @async
 * @function createBoard
 * @param {number|string} workspaceId - ID workspace yang akan di-assign
 * @param {string} name - Nama board yang akan dibuat
 * @param {string} token - Token untuk verifikasi otoritas
 * @returns {Promise<Model>} Board yang baru dibuat
 * @throws {Error} Jika workspace tidak ditemukan
 * @example
 * const newBoard = await createBoard(1, 'Project X', 'token');
 */
const createBoard = async ({ name, workspaceId, ownerId, visibility }) => {
  if (!workspaceId) throw new Error("Unauthorized: Workspace Id is required");

  // Membuat board baru yang terhubung dengan workspace
  const board = await boardModel.create({
    name,
    visibility,
    workspace_id: workspaceId,
    owner_id: ownerId,
  });

  await boardMemberModel.create({
    board_id: board.id,
    user_id: ownerId,
    role: "admin",
  });

  return board;
};

const createDefaultBoard = async ({ name, workspaceId, ownerId }) => {
  if (!workspaceId) throw new Error("Unauthorized: Workspace Id is required");

  const board = await boardModel.create({
    name,
    visibility: "private",
    workspace_id: workspaceId,
    owner_id: ownerId,
  });

  return board;
};

// Fungsi untuk mengambil semua board yang ada dalam satu workspace

/**
 * Mengambil semua board yang ada dalam satu workspace
 * @async
 * @function getBoards
 * @param {number|string} workspaceId - ID workspace yang akan di-assign
 * @param {string} token - Token untuk verifikasi otoritas
 * @returns {Promise<Model[]>} Array dari semua board yang ada di workspace
 * @throws {Error} Jika workspace tidak ditemukan
 * @example
 * const boards = await getBoards(1, 'token');
 */
const getBoards = async (workspaceId, token) => {
  const workspace = await getWorkspaceById(workspaceId, token);
  if (!workspace) throw new Error("Workspace not found");

  const boards = await boardModel.findAll({
    where: {
      workspace_id: workspace.data.id,
    },
  });

  return boards;
};

/**
 * Mengambil satu board berdasarkan ID-nya
 * @async
 * @function getBoardById
 * @param {number|string} boardId - ID board yang akan diambil
 * @returns {Promise<Model|null>} Board yang ditemukan, atau null jika tidak ada
 * @throws {Error} Jika board tidak ditemukan
 * @example
 * const board = await getBoardById(1);
 * console.log(board);
 */

const getBoardById = async (boardId) => {
  // Mencari board berdasarkan primary key (ID)
  const board = await boardModel.findByPk(boardId, {
    include: [
      {
        model: listModel,
        as: "lists",
        include: [
          {
            model: taskModel,
            as: "tasks",
          },
        ],
      },
    ],
    order: [
      [{ model: listModel, as: "lists" }, "position", "ASC"],
      [
        { model: listModel, as: "lists" },
        { model: taskModel, as: "tasks" },
        "position",
        "ASC",
      ],
    ],
  });

  if (!board) throw new Error("Board not found");

  return board;
};

// Fungsi untuk memperbarui nama board berdasarkan ID

/**
 * Memperbarui nama board berdasarkan ID-nya
 * @async
 * @function updateBoard
 * @param {number|string} boardId - ID board yang akan diperbarui
 * @param {string} name - Nama baru untuk board
 * @returns {Promise<Model>} Board yang telah diperbarui
 * @throws {Error} Jika board tidak ditemukan
 * @example
 * const updatedBoard = await updateBoard(1, 'New Board Name');
 */

const updateBoard = async (boardId, name) => {
  // Mencari board berdasarkan ID
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found");
  if (board.name === name) return board;

  return board.update({ name });
};

// Fungsi untuk menghapus board berdasarkan ID

/**
 * Menghapus board berdasarkan ID.
 * @async
 * @function deleteBoard
 * @param {number|string} boardId - ID board yang akan dihapus
 * @returns {Promise<Model|null>} Board yang dihapus, atau null jika board tidak ditemukan
 * @throws {Error} Jika board tidak ditemukan
 * @example
 * const deletedBoard = await deleteBoard(1);
 * console.log(deletedBoard);
 */
const deleteBoard = async (boardId) => {
  // Mencari board berdasarkan ID
  const board = await boardModel.findByPk(boardId);

  if (!board) throw new Error("Board not found");

  return board.destroy();
};

const deleteBoardsByWorkspaceId = async (workspaceId) => {
  return boardModel.destroy({
    where: {
      workspace_id: workspaceId,
    },
  });
};

const addBoardMembers = async (boardId, email, role, token) => {
  if (!email || !role) {
    throw new Error("Email and role are required fields.");
  }

  const responseUser = await findUserByEmail(email, token);
  if (!responseUser || !responseUser.data) {
    throw new Error(
      "Invalid response from User Service when fetching by email."
    );
  }

  const userToAdd = responseUser.data;
  const userId = userToAdd.id;

  const existingMember = await boardMemberModel.findOne({
    where: {
      board_id: boardId,
      user_id: userId,
    },
  });

  if (existingMember) {
    throw new Error("This user is already a member of the board.");
  }

  const board = await boardModel.findByPk(boardId, {
    attributes: ["workspace_id"],
  });

  if (!board) {
    throw new Error("Board not found.");
  }

  await boardMemberModel.create({
    board_id: boardId,
    user_id: userId,
    role: role,
  });

  await boardEventProducer.sendMemberAddedToBoardEvent({
    userId: userId,
    workspaceId: board.workspace_id,
    role: role,
  });

  return {
    id: userToAdd.id,
    username: userToAdd.username,
    name: userToAdd.name,
    email: userToAdd.email,
    role: role,
  };
};

const getBoardMembers = async (boardId, token) => {
  const membersInBoard = await boardMemberModel.findAll({
    where: { board_id: boardId },
    attributes: ["user_id", "role"],
    raw: true,
  });

  if (!membersInBoard || membersInBoard.length === 0) {
    return [];
  }

  const userIds = membersInBoard.map((member) => member.user_id);

  const usersDataResponse = await userResponse(token, userIds);

  if (!usersDataResponse) {
    console.error("Failed to fetch user details from User Service.");
    return [];
  }
  const usersData = usersDataResponse.data;

  const hydratedMembers = membersInBoard.map((member) => {
    const userDetail = usersData.find((user) => user.id === member.user_id);
    return {
      id: member.user_id,
      username: userDetail ? userDetail.username : "UnknownUser",
      name: userDetail ? userDetail.name : "Unknown User",
      email: userDetail ? userDetail.email : "N/A",
      role: member.role,
    };
  });

  return hydratedMembers;
};

const getBoardsForUser = async (userId, token) => {
  const memberships = await boardMemberModel.findAll({
    where: { user_id: userId },
    attributes: ["board_id"],
    raw: true,
  });
  const memberBoardIds = memberships.map((m) => m.board_id);

  const ownedBoards = await boardModel.findAll({
    where: { owner_id: userId },
    attributes: ["id"],
    raw: true,
  });
  const ownedBoardIds = ownedBoards.map((b) => b.id);

  const allBoardIds = [...new Set([...memberBoardIds, ...ownedBoardIds])];

  if (allBoardIds.length === 0) {
    return [];
  }

  const boards = await boardModel.findAll({
    where: {
      id: { [Op.in]: allBoardIds },
    },
    raw: true,
  });

  if (boards.length === 0) {
    return [];
  }

  const uniqueWorkspaceIds = [...new Set(boards.map((b) => b.workspace_id))];
  const workspacePromises = uniqueWorkspaceIds.map((wsId) =>
    getWorkspaceById(wsId, token)
  );
  const workspaceResponses = await Promise.all(workspacePromises);
  const workspaceMap = new Map();
  workspaceResponses.forEach((response) => {
    if (response && response.data) {
      workspaceMap.set(response.data.id, response.data);
    }
  });

  const hydratedBoards = boards.map((board) => {
    const workspaceData = workspaceMap.get(board.workspace_id);
    return {
      ...board,
      workspace: workspaceData || {
        name: "Unknown Workspace",
        id: board.workspace_id,
      },
    };
  });

  hydratedBoards.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return hydratedBoards;
};

// Mengekspor semua fungsi agar bisa digunakan di file lain
module.exports = {
  createBoard,
  createDefaultBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  deleteBoardsByWorkspaceId,
  addBoardMembers,
  getBoardMembers,
  getBoardsForUser,
};
