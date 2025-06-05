const kafka = require("../../config/kafkaClient");
const { EMAIL_EVENTS } = require("../topic");

const producer = kafka.producer();

const sendEmailEvent = async (payload) => {
  await producer.connect();
  await producer.send({
    topic: EMAIL_EVENTS,
    messages: [
      {
        key: "sendEmail",
        value: JSON.stringify(payload),
      },
    ],
  });
  await producer.disconnect();
};

module.exports = { sendEmailEvent };
