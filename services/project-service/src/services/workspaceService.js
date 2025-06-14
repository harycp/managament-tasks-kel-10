// workspaceService.js
const axios = require("axios");

const WORKSPACE_SERVICE_URL =
  process.env.WORKSPACE_SERVICE_URL || "http://localhost:5002/api/workspaces";

const getWorkspaceById = async (workspaceId, token) => {
  try {
    const response = await axios.get(
      `${WORKSPACE_SERVICE_URL}/${workspaceId}`,
      {
        headers: {
          Cookie: `authToken=${token}`, // ← Kirim cookie secara manual
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching workspace:", error.message);
    return null;
  }
};

module.exports = { getWorkspaceById };
