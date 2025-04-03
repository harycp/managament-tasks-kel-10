const userService = require("../services/userService");

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const { user, token } = await userService.loginUser(
      usernameOrEmail,
      password
    );
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false, // Gunakan secure=true jika di production (HTTPS) pake NODE_ENV PRODUCTION
      sameSite: "Lax",
      domain: "localhost",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "User logged in successfully",
      data: { user }, // ✅ Tidak mengembalikan token ke frontend
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    await userService.logoutUser();

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      domain: "localhost",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to logout" });
  }
};

const getUserLogin = async (req, res) => {
  try {
    const user = await userService.getUserLogin(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User retrieved", data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registerEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const response = await userService.registerEmail(email);
    res
      .status(200)
      .json({ message: "Confirmation email sent", data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token, userData } = req.body;
    const response = await userService.verifyEmail(token, userData);

    res
      .status(201)
      .json({ message: "User registered successfully", data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await userService.requestResetPassword(email);
    res
      .status(200)
      .json({ message: "Password reset email sent", data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const response = await userService.resetPassword(token, newPassword);
    res
      .status(200)
      .json({ message: "Password reset successful", data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;
    const isValid = await userService.verifyResetToken(token);
    res.status(200).json({ message: "Token is valid", valid: isValid });
  } catch (error) {
    res.status(500).json({ error: error.message, valid: false });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ message: "Users retrieved", data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      message: "User retrieved",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated", data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted", data: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);
    res.status(200).json({ message: "User retrieved", data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  registerEmail,
  verifyEmail,
  requestResetPassword,
  resetPassword,
  verifyResetToken,
  getUserLogin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
