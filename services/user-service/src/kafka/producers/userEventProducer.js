const kafka = require("../../config/kafkaClient");

const { USER_EVENTS } = require("../topics");

const producer = kafka.producer();

const sendUserRegisteredEvent = async (data) => {
  await producer.connect();
  await producer.send({
    topic: USER_EVENTS,
    messages: [
      {
        key: "userRegistered",
        value: JSON.stringify(data),
      },
    ],
  });
  await producer.disconnect();
};

module.exports = { sendUserRegisteredEvent };
