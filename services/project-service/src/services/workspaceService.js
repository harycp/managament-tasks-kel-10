// workspaceService.js
const axios = require("axios");

const WORKSPACE_SERVICE_URL = "http://localhost:5002/api/workspaces";

async function getWorkspaceById(workspaceId, token) {
  try {
    // Kirim token lewat cookie
    const response = await axios.get(
      `${WORKSPACE_SERVICE_URL}/${workspaceId}`,
      {
        withCredentials: true, // Penting agar cookie dikirim
        headers: {
          Cookie: `authToken=${token}`, // Set cookie secara manual
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching workspace:", error.message);
    return null;
  }
}

module.exports = { getWorkspaceById };
