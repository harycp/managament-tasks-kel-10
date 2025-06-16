import axios from "axios";

export const checkAuth = async () => {
  try {
    const response = await axios.get(
      "http://localhost/user-service/auth/check-auth",
      {
        withCredentials: true,
      }
    );
    return response.data.authenticated;
  } catch {
    return false;
  }
};

export const verifyResetToken = async (token) => {
  try {
    const response = await axios.get(
      `http://localhost/user-service/auth/verify-reset-token?token=${token}`
    );
    return response.data.valid;
  } catch (error) {
    return false;
  }
};
