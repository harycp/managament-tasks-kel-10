const kafka = require("../../config/kafkaClient");
const { BOARD_EVENTS } = require("../topic");
const workspaceMemberService = require("../../services/workspaceMemberService");

const consumer = kafka.consumer({ groupId: "workspace-service-group" });

const runBoardConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: BOARD_EVENTS, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key.toString();
      const data = JSON.parse(message.value.toString());

      if (key === "memberAddedToBoard") {
        const { userId, workspaceId, role } = data;
        await workspaceMemberService.addMemberById(workspaceId, userId, role);
        console.log(`[WorkspaceService] Received event: ${key}`);
      }
    },
  });
};

module.exports = { runBoardConsumer };
