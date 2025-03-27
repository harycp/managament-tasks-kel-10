import axios from "axios";

export const checkAuth = async () => {
  try {
    const response = await axios.get("http://localhost:5001/auth/check-auth", {
      withCredentials: true,
    });
    return response.data.authenticated;
  } catch (error) {
    return false;
  }
};
