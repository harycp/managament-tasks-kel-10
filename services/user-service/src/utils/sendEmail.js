const nodemailer = require("nodemailer");
require;

const sendEmail = async (email, subject, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Tuntask" <no-reply@tuntask.com>',
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
