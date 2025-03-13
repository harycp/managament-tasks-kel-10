const axios = require("axios");

const WORKSPACE_SERVICE_URL = "http://localhost:5002/api/workspaces";

async function getWorkspaceById(workspaceId, token) {
  try {
    const response = await axios.get(
      `${WORKSPACE_SERVICE_URL}/${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Fetched workspace:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching workspace:", error.message);
    return null; // Pastikan tidak menyebabkan crash
  }
}

module.exports = { getWorkspaceById };
