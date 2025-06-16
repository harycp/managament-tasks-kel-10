const axios = require("axios");

const WORKSPACE_SERVICE_URL =
  "http://api-gateway-service:5000/workspace-service/api/workspaces";

const getWorkspaceById = async (workspaceId, token) => {
  try {
    const response = await axios.get(
      `${WORKSPACE_SERVICE_URL}/${workspaceId}`,
      {
        headers: {
          Cookie: `authToken=${token}`,
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
