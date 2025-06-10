const axios = require("axios");

const USER_SERVICE_URL = "http://localhost:5001/api/users";

const userResponse = async (token, userIds) => {
  try {
    const response = await axios.post(
      `${USER_SERVICE_URL}/batch`,
      { userIds },
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

module.exports = { userResponse };
