const { Worker } = require("bullmq");
const redisClient = require("../utils/redisClient");
const boardService = require("../services/boardService");

const worker = new Worker(
  "boardEventQueue",
  async (job) => {
    if (job.name === "workspaceCreated") {
      const { workspaceId, workspaceName, ownerId } = job.data;

      await boardService.createDefaultBoard({
        name: `${workspaceName} Board`,
        workspaceId,
        ownerId,
      });

      console.log(
        `[BoardWorker] Default board created for workspace ${workspaceName}`
      );
    }
  },
  {
    connection: redisClient.options,
  }
);

worker.on("failed", (job, err) => {
  console.error(`[BoardWorker] Failed job ${job.id}`, err);
});

module.exports = worker;
