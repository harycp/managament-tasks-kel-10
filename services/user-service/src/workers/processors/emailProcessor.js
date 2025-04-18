const sendEmail = require("../../utils/sendEmail");

const emailProcessor = async (job) => {
  const { to, subject, html } = job.data;

  try {
    await sendEmail(to, subject, html);
    console.log(`[EmailWorker] Email sent to ${to}`);
  } catch (err) {
    console.error(`[EmailWorker] Failed to send email to ${to}`, err);
    throw err;
  }
};

module.exports = emailProcessor;