const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateToken, verifyToken } = require("../utils/jwt");
const { Op } = require("sequelize");
const sendEmail = require("../utils/sendEmail");

const createUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) throw new Error("User Already Exists");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({ ...userData, password: hashedPassword });
};

const loginUser = async (usernameOrEmail, password) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = generateToken({ id: user.id });

  return { user, token };
};

const logoutUser = async () => {
  return true;
};

const requestResetPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const token = generateToken({ id: user.id });
  const resetLink = `${process.env.RESET_PASSWORD_URL}?token${token}`;

  await sendEmail(
    user.email,
    "Reset Password",
    `<p>Klik link berikut untuk mereset password Anda:</p>
       <a href="${resetLink}">${resetLink}</a>`
  );

  return { message: "Password reset link sent to your email" };
};

const resetPassword = async (token, newPassword) => {
  const { id } = verifyToken(token);
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });

  return user;
};

const getUserLogin = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ["id", "username", "email", "name"],
  });

  return user;
};

const getUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  await user.update(userData);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
  };
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUserLogin,
  requestResetPassword,
  resetPassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
