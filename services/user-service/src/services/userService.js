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
  // console.log(token);
  const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

  // console.log(resetLink);

  const emailContent = `
  <div style="font-family: 'Courier New', Courier, monospace; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #2d2d2d; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid #4b4b4b;">
      <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #4b4b4b; position: relative;">
        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background-color: #4b4b4b; padding: 5px 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
          <h1 style="color: #e5e5e5; font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0;">🔒 Tuntask</h1>
        </div>
        <h2 style="color: #e5e5e5; font-size: 20px; font-weight: bold; letter-spacing: 1px; margin-top: 40px;">Password Reset Request</h2>
      </header>
      <main style="padding: 20px 0; color: #7a7a7a; line-height: 1.6;">
        <p style="font-size: 16px; color: #7a7a7a;">Hey there,</p>
        <p style="font-size: 16px; color: #7a7a7a;">It looks like you need to reset your password. Click the button below:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4b4b4b; color: #e5e5e5; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold; margin-top: 10px; box-shadow: 2px 2px #1f1f1f;">Reset Password</a>
        <p style="font-size: 14px; color: #7a7a7a; margin-top: 20px;">If this wasn't you, feel free to ignore this email.</p>
      </main>
      <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #4b4b4b; font-size: 12px; color: #7a7a7a;">
        <p>© ${new Date().getFullYear()} Tuntask. All rights reserved.</p>
      </footer>
    </div>
  </div>
`;

  await sendEmail(user.email, "Reset Password", emailContent);

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
