const kafka = require("../../config/kafkaClient");

const { WORKSPACE_EVENTS } = require("../topic");
const boardService = require("../../services/boardService");

const consumer = kafka.consumer({ groupId: "board-service-group" });

const runWorkspaceConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: WORKSPACE_EVENTS, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key.toString();
      const data = JSON.parse(message.value.toString());

      if (key === "workspaceCreated") {
        const { workspaceId, workspaceName, ownerId } = data;
        await boardService.createDefaultBoard({
          name: `${workspaceName} Board`,
          visibility: "private",
          workspaceId,
          ownerId,
        });
        console.log(
          `[BoardService] Default board created for ${workspaceName}`
        );
      }

      if (key === "workspaceDeleted") {
        const { workspaceId } = data;
        await boardService.deleteBoardsByWorkspaceId(workspaceId);
        console.log(
          `[BoardService] Boards deleted for workspace ${workspaceId}`
        );
      }
    },
  });
};

module.exports = { runWorkspaceConsumer };
