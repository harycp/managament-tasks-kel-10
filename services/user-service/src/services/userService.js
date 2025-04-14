const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../utils/jwt");
const { Op } = require("sequelize");
const sendEmail = require("../utils/sendEmail");
const redis = require("../utils/redisClient");

const User = require("../models/user");
const { sequelize } = require("../models");

const createUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) throw new Error("User Already Exists");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({ ...userData, password: hashedPassword });
};

const registerEmail = async (email) => {
  let user = await User.findOne({
    where: { email },
    paranoid: false,
  });

  if (user) {
    if (user.deletedAt) {
      await user.restore();
    } else {
      throw new Error("User Already Exists");
    }
  } else {
    user = await User.create({ email });
  }

  const token = generateToken({ id: user.id });
  const confirmLink = `${process.env.CONFIRM_EMAIL_URL}?token=${token}`;

  const key = `email-confirm:${token}`;
  const expiresInSeconds = 60 * 60; // 1 Jam

  await redis.set(key, user.id, "EX", expiresInSeconds);

  // await ConfirmEmailToken.create({
  //   user_id: user.id,
  //   token: token,
  //   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  //   used: false,
  // });

  const emailContent = `
  <div style="font-family: Arial, Helvetica, sans-serif; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid #4b4b4b;">
      <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #4b4b4b; position: relative;">
        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background-color: #4b4b4b; padding: 5px 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
          <h1 style="color: #e5e5e5; font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0;">Email Confirmation</h1>
        </div>
      </header>
      <main style="padding: 20px 0; color: #7a7a7a; line-height: 1.6;">
        <p style="font-size: 16px; color: #7a7a7a;">Hey there,</p>
        <p style="font-size: 16px; color: #7a7a7a;">It looks like you need to confirm your email. Click the button below:</p>
        <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #4b4b4b; color: #e5e5e5; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold; margin-top: 10px; box-shadow: 2px 2px #1f1f1f;">Confirm Email</a>
        <p style="font-size: 14px; color: #7a7a7a; margin-top: 20px;">If this wasn't you, feel free to ignore this email.</p>
      </main>
      <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #4b4b4b; font-size: 12px; color: #7a7a7a;">
        <p>© ${new Date().getFullYear()} Tuntask. All rights reserved.</p>
      </footer>
    </div>
  </div>
`;

  await sendEmail(user.email, "Confirm Email", emailContent);

  return { message: "Email confirmation link sent to your email" };
};

const verifyEmail = async (token, userData) => {
  // const confirmEmailToken = await ConfirmEmailToken.findOne({
  //   where: {
  //     token: token,
  //     used: false,
  //     expiresAt: { [Op.gt]: new Date() },
  //   },
  // });

  // if (!confirmEmailToken) throw new Error("Invalid or expired token");

  const { id } = verifyToken(token);
  const key = `email-confirm:${token}`;

  const userId = await redis.get(key);
  if (!userId) throw new Error("Invalid or expired token");

  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  await user.update({
    ...userData,
    password: hashedPassword,
    isVerified: true,
  });

  await redis.del(key);

  return user;
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
  
  // Hapus password dari objek user
  const userWithoutPassword = { ...user.get({ plain: true }) };
  delete userWithoutPassword.password;

  return { user: userWithoutPassword, token };
};

const logoutUser = async () => {
  return true;
};

const requestResetPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const token = generateToken({ id: user.id });

  const key = `reset-password:${token}`;
  const expiresInSeconds = 60 * 60; // 1 Jam

  await redis.set(key, user.id, "EX", expiresInSeconds);

  const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

  // await ResetPasswordToken.create({
  //   user_id: user.id,
  //   token: token,
  //   expiresAt: new Date(Date.now() + 360000),
  //   used: false,
  // });

  const emailContent = `
  <div style="font-family: Arial, Helvetica, sans-serif; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid #4b4b4b;">
      <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #4b4b4b; position: relative;">
        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background-color: #4b4b4b; padding: 5px 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
          <h1 style="color: #e5e5e5; font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0;">Password Reset Request</h1>
        </div>
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
  const key = `reset-password:${token}`;
  const userId = await redis.get(key);
  if (!userId) throw new Error("Invalid or expired token");

  // const resetPasswordToken = await ResetPasswordToken.findOne({
  //   where: {
  //     token: token,
  //     used: false,
  //     expiresAt: { [Op.gt]: new Date() },
  //   },
  // });

  // if (!resetPasswordToken) throw new Error("Invalid or expired token");

  const { id } = verifyToken(token);
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });

  await redis.del(key);

  // await resetPasswordToken.update({ used: true });

  return user;
};

const verifyResetToken = async (token) => {
  // const resetPasswordToken = await ResetPasswordToken.findOne({
  //   where: {
  //     token: token,
  //     used: false,
  //     expiresAt: { [Op.gt]: new Date() },
  //   },
  // });

  const resetKey = `reset-password:${token}`;
  const resetTokenExists = await redis.exists(resetKey);

  const confirmEmailKey = `email-confirm:${token}`;
  const confirmEmailTokenExists = await redis.exists(confirmEmailKey);

  // const confirmEmailToken = await ConfirmEmailToken.findOne({
  //   where: {
  //     token: token,
  //     used: false,
  //     expiresAt: { [Op.gt]: new Date() },
  //   },
  // });

  return resetTokenExists || confirmEmailTokenExists ? true : false;
};

const getUserLogin = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ["id", "username", "email", "name", "createdAt"],
  });

  return user;
};

const verifyPassword = async (userId, password) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  return true;
};

const requestOtp = async (email, newEmail) => {
  const userWithSameEmail = await User.findOne({ where: { email: newEmail } });
  if (userWithSameEmail) throw new Error("User with this email already exist");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const key = `otp-code:${otp}`;
  const expiresInSeconds = 60 * 60; // 1 Jam

  await redis.set(key, user.id, "EX", expiresInSeconds);

  // await RequestOtp.create({
  //   user_id: user.id,
  //   otp: otp,
  //   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  //   used: false,
  // });

  const emailContent = `
  <div style="font-family: Arial, Helvetica, sans-serif; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid #4b4b4b;">
      <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #4b4b4b; position: relative;">
        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background-color: #4b4b4b; padding: 5px 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
          <h1 style="color: #e5e5e5; font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0;">Kode OTP</h1>
        </div>
      </header>
      <main style="padding: 20px 0; color: #7a7a7a; line-height: 1.6;">
        <p style="font-size: 16px; color: #7a7a7a;">Hey there,</p>
        <p style="font-size: 16px; color: #7a7a7a;">It looks like you need to confirm email with OTP.</p>
        <p style="font-size: 22px; color: #7a7a7a;">${otp}</p>
        <p style="font-size: 14px; color: #7a7a7a; margin-top: 20px;">If this wasn't you, feel free to ignore this email.</p>
      </main>
      <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #4b4b4b; font-size: 12px; color: #7a7a7a;">
        <p>© ${new Date().getFullYear()} Tuntask. All rights reserved.</p>
      </footer>
    </div>
  </div>
`;

  await sendEmail(newEmail, "Kode OTP", emailContent);

  return { message: "OTP sent to your email" };
};

const verifyUpdatedEmail = async (otp, email) => {
  const key = `otp-code:${otp}`;
  const userId = await redis.get(key);
  if (!userId) throw new Error("Invalid or expired otp");

  // const requestOtp = await RequestOtp.findOne({
  //   where: {
  //     otp: otp,
  //     used: false,
  //     expiresAt: { [Op.gt]: new Date() },
  //   },
  //   include: [{ model: User, as: "user" }],
  // });

  // if (!requestOtp) throw new Error("Invalid or expired otp");

  // const { id } = requestOtp.user;
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // await requestOtp.update({ used: true });

  await redis.del(key);

  await user.update({ email: email });

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

  if (userData.username) {
    const userWithSameUsername = await User.findOne({
      where: { username: userData.username },
    });
    if (userWithSameUsername)
      throw new Error("User with this username already exist");
  }

  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  await user.update(userData);
  return user;
};

const updatePassword = async (id, oldPassword, newPassword) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });

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
  registerEmail,
  verifyEmail,
  requestResetPassword,
  verifyResetToken,
  resetPassword,
  verifyPassword,
  requestOtp,
  verifyUpdatedEmail,
  getUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
  getUserByEmail,
};
