const axios = require("axios");

const USER_SERVICE_URL = "http://localhost:5001/api/users";

const userResponse = async (token, userIds) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/batch?ids=${userIds.join(",")}`,
      {
        headers: {
          Cookie: `authToken=${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching board:", error.message);
    return null;
  }
};

const findUserByEmail = async (email, token) => {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await axios.get(
      `${USER_SERVICE_URL}/by-email?email=${encodedEmail}`,
      {
        headers: {
          Cookie: `authToken=${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`User with email "${email}" was not found.`);
    }
    console.error("Error finding user by email:", error.message);
    throw new Error("Error communicating with User Service.");
  }
};

module.exports = { userResponse, findUserByEmail };
