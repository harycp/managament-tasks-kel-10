const kafka = require("../../config/kafkaClient");
const { EMAIL_EVENTS } = require("../topic");
const sendEmail = require("../../utils/sendEmail");

const consumer = kafka.consumer({ groupId: "email-service-group" });

const runEmailConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: EMAIL_EVENTS, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key.toString();
      const data = JSON.parse(message.value.toString());

      if (key === "sendEmail") {
        const { to, subject, html } = data;
        try {
          await sendEmail(to, subject, html);
          console.log(`[EmailWorker] Email sent to ${to}`);
        } catch (err) {
          console.error(`[EmailWorker] Failed to send email to ${to}`, err);
        }
      }
    },
  });
};

module.exports = { runEmailConsumer };