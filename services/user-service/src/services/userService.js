const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../utils/jwt");
const { Op } = require("sequelize");
const sendEmail = require("../utils/sendEmail");
const redis = require("../utils/redisClient");
const emailQueue = require("../workers/queues/emailQueue");
const userEventQueue = require("../workers/queues/userEventQueue");

const User = require("../models/user");
const { sequelize } = require("../models");

/**
 * Module untuk mengelola data pengguna.
 * @module userService
 */

/**
 * Membuat pengguna baru dengan password yang di-hash.
 * @param {Object} userData - Data pengguna yang akan dibuat.
 * @param {string} userData.email - Email pengguna.
 * @param {string} userData.password - Password pengguna.
 * @returns {Promise<Object>} Pengguna yang berhasil dibuat.
 * @throws {Error} Jika pengguna dengan email tersebut sudah ada.
 */
const createUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) throw new Error("User Already Exists");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({ ...userData, password: hashedPassword });
};

/**
 * Melakukan pendaftaran email dan mengirimkan link konfirmasi.
 * Jika user sebelumnya dihapus (soft delete), maka akan direstore.
 * @param {string} email - Email yang ingin didaftarkan.
 * @returns {Promise<Object>} Status pengiriman email konfirmasi.
 * @throws {Error} Jika pengguna sudah terdaftar dan belum dihapus.
 */
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

  // await sendEmail(user.email, "Confirm Email", emailContent);
  await emailQueue.add("send-confirm-email", {
    to: user.email,
    subject: "Confirm Email",
    html: emailContent,
  });

  return { message: "Email confirmation link sent to your email" };
};

/**
 * Verifikasi email menggunakan token dan memperbarui data pengguna.
 * @param {string} token - Token dari email konfirmasi.
 * @param {Object} userData - Data pengguna yang akan diupdate (nama, username, password).
 * @returns {Promise<Object>} Data pengguna yang telah diupdate.
 * @throws {Error} Jika token tidak valid, expired, atau user tidak ditemukan.
 */

const verifyEmail = async (token, userData) => {
  const { id } = verifyToken(token);
  const key = `email-confirm:${token}`;

  const userId = await redis.get(key);
  if (!userId) throw new Error("Invalid or expired token");

  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  await userEventQueue.add("userRegistered", {
    userId: user.id,
    email: user.email,
  });

  await user.update({
    ...userData,
    password: hashedPassword,
    isVerified: true,
  });

  await redis.del(key);

  return user;
};

/**
 * Melakukan login pengguna berdasarkan email atau username.
 * @param {string} usernameOrEmail - Username atau email pengguna.
 * @param {string} password - Password pengguna.
 * @returns {Promise<Object>} Data pengguna dan token autentikasi.
 * @throws {Error} Jika pengguna tidak ditemukan atau password salah.
 */
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

/**
 * Logout pengguna (sementara hanya placeholder, tidak menyimpan session).
 * @returns {Promise<boolean>} Selalu mengembalikan nilai true.
 */
const logoutUser = async () => {
  return true;
};

/**
 * Mengirimkan link reset password ke email pengguna.
 * Token disimpan sementara di Redis.
 * @param {string} email - Email pengguna yang ingin mereset password.
 * @returns {Promise<Object>} Status pengiriman email reset password.
 * @throws {Error} Jika pengguna tidak ditemukan.
 */
const requestResetPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const token = generateToken({ id: user.id });

  const key = `reset-password:${token}`;
  const expiresInSeconds = 60 * 60; // 1 Jam

  await redis.set(key, user.id, "EX", expiresInSeconds);

  const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

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

  await emailQueue.add("reset-password", {
    to: user.email,
    subject: "Reset Password",
    html: emailContent,
  });

  return { message: "Password reset link sent to your email" };
};

/**
 * Melakukan reset password berdasarkan token yang dikirim melalui email.
 * @param {string} token - Token reset password.
 * @param {string} newPassword - Password baru yang ingin diset.
 * @returns {Promise<Object>} Pengguna yang berhasil diupdate.
 * @throws {Error} Jika token tidak valid, kadaluarsa, atau pengguna tidak ditemukan.
 */
const resetPassword = async (token, newPassword) => {
  const key = `reset-password:${token}`;
  const userId = await redis.get(key);
  if (!userId) throw new Error("Invalid or expired token");

  const { id } = verifyToken(token);
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });

  await redis.del(key);

  return user;
};

/**
 * Mengecek apakah token (reset password / konfirmasi email) masih valid.
 * @param {string} token - Token yang ingin diverifikasi.
 * @returns {Promise<boolean>} True jika token masih valid, false jika tidak.
 */
const verifyResetToken = async (token) => {
  const resetKey = `reset-password:${token}`;
  const resetTokenExists = await redis.exists(resetKey);

  const confirmEmailKey = `email-confirm:${token}`;
  const confirmEmailTokenExists = await redis.exists(confirmEmailKey);

  return resetTokenExists || confirmEmailTokenExists ? true : false;
};

/**
 * Mengambil data pengguna yang sedang login berdasarkan ID.
 * @param {number} id - ID pengguna.
 * @returns {Promise<Object>} Objek pengguna dengan field yang dipilih.
 */
const getUserLogin = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ["id", "username", "email", "name", "createdAt"],
  });

  return user;
};

/**
 * Memverifikasi password lama pengguna (biasanya untuk update password/email).
 * @param {number} userId - ID pengguna.
 * @param {string} password - Password yang ingin diverifikasi.
 * @returns {Promise<boolean>} True jika password cocok, error jika tidak cocok atau user tidak ditemukan.
 */
const verifyPassword = async (userId, password) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  return true;
};

/**
 * Mengirim OTP ke email baru pengguna untuk konfirmasi perubahan email.
 * @param {string} email - Email lama pengguna (yang sudah login).
 * @param {string} newEmail - Email baru yang ingin digunakan.
 * @returns {Promise<Object>} Status pengiriman OTP.
 * @throws {Error} Jika email baru sudah terdaftar atau pengguna tidak ditemukan.
 */
const requestOtp = async (email, newEmail) => {
  const userWithSameEmail = await User.findOne({ where: { email: newEmail } });
  if (userWithSameEmail) throw new Error("User with this email already exist");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const key = `otp-code:${otp}`;
  const expiresInSeconds = 60 * 60; // 1 Jam

  await redis.set(key, user.id, "EX", expiresInSeconds);

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

  await emailQueue.add("request-otp", {
    to: newEmail,
    subject: "Kode OTP",
    html: emailContent,
  });

  return { message: "OTP sent to your email" };
};

/**
 * Verifikasi OTP untuk mengganti email pengguna.
 * @param {string} otp - Kode OTP yang dikirimkan ke email baru.
 * @param {string} email - Email baru yang akan diperbarui ke akun.
 * @returns {Promise<Object>} Pengguna setelah update email.
 * @throws {Error} Jika OTP tidak valid atau pengguna tidak ditemukan.
 */
const verifyUpdatedEmail = async (otp, email) => {
  const key = `otp-code:${otp}`;
  const userId = await redis.get(key);
  if (!userId) throw new Error("Invalid or expired otp");

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await redis.del(key);

  await user.update({ email: email });

  return user;
};

/**
 * Mengambil semua data pengguna dari database.
 * @returns {Promise<Array<Object>>} Array berisi semua pengguna.
 */
const getUsers = async () => {
  return await User.findAll();
};

/**
 * Mengambil data pengguna berdasarkan ID.
 * @param {number} id - ID pengguna.
 * @returns {Promise<Object|null>} Objek pengguna jika ditemukan, null jika tidak.
 */
const getUserById = async (id) => {
  return await User.findByPk(id);
};

/**
 * Memperbarui data pengguna.
 * @param {number} id - ID pengguna yang akan diupdate.
 * @param {Object} userData - Data pengguna baru.
 * @returns {Promise<Object|null>} Pengguna yang diperbarui atau null jika tidak ditemukan.
 * @throws {Error} Jika username baru sudah digunakan pengguna lain.
 */
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

/**
 * Memperbarui password pengguna setelah memverifikasi password lama.
 * @param {number} id - ID pengguna.
 * @param {string} oldPassword - Password lama pengguna.
 * @param {string} newPassword - Password baru yang ingin diatur.
 * @returns {Promise<Object|null>} Pengguna yang diperbarui atau null jika tidak ditemukan.
 * @throws {Error} Jika password lama tidak cocok.
 */
const updatePassword = async (id, oldPassword, newPassword) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });

  return user;
};

/**
 * Menghapus pengguna berdasarkan ID.
 * @param {number} id - ID pengguna yang akan dihapus.
 * @returns {Promise<Object|null>} Pengguna yang dihapus atau null jika tidak ditemukan.
 */
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.destroy();
  return user;
};

/**
 * Mengambil data pengguna berdasarkan email.
 * @param {string} email - Email pengguna.
 * @returns {Promise<Object|null>} Objek pengguna yang berisi field dasar (id, username, email, name) atau null jika tidak ditemukan.
 */
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
