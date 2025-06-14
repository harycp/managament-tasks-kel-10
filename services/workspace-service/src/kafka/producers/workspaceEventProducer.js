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

const sendWorkspaceDeletedEvent = async (data) => {
  await producer.connect();
  await producer.send({
    topic: WORKSPACE_EVENTS,
    messages: [
      {
        key: "workspaceDeleted",
        value: JSON.stringify(data),
      },
    ],
  });
  await producer.disconnect();
};

const sendMemberRemovedEvent = async (data) => {
  try {
    await producer.connect();
    await producer.send({
      topic: WORKSPACE_EVENTS,
      messages: [
        {
          key: "memberRemovedFromWorkspace",
          value: JSON.stringify(data),
        },
      ],
    });
    console.log('[WorkspaceService] Event "memberRemovedFromWorkspace" sent.');
  } catch (error) {
    console.error("Failed to send member removed event:", error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = {
  sendWorkspaceCreatedEvent,
  sendWorkspaceDeletedEvent,
  sendMemberRemovedEvent,
};
