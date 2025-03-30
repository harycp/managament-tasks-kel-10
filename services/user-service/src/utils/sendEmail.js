const nodemailer = require("nodemailer");

const sendEmaill = async (email, subject, message) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
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

module.exports = sendEmaill;
