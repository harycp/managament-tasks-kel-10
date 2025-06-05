const kafka = require("../../config/kafkaClient");

const { WORKSPACE_EVENTS } = require("../topic");

const producer = kafka.producer();

const sendWorkspaceCreatedEvent = async (data) => {
  await producer.connect();
  await producer.send({
    topic: WORKSPACE_EVENTS,
    messages: [
      {
        key: "workspaceCreated",
        value: JSON.stringify(data),
      },
    ],
  });
  await producer.disconnect();
};

module.exports = { sendWorkspaceCreatedEvent };
