const kafka = require("../../config/kafkaClient");

const { USER_EVENTS } = require("../topic");
const workspaceService = require("../../services/workspaceService");

const consumer = kafka.consumer({ groupId: "workspace-service-group" });

const runUserConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: USER_EVENTS, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key.toString();
      const data = JSON.parse(message.value.toString());

      if (key === "userRegistered") {
        const { userId } = data;
        await workspaceService.createDefaultWorkspace(userId);
        console.log(
          `[WorkspaceService] Default workspace created for ${userId}`
        );
      }
    },
  });
};

module.exports = { runUserConsumer };
