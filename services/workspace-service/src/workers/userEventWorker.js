const { Worker } = require("bullmq");
const redisClient = require("../utils/redisClient");
const workspaceService = require("../services/workspaceService");

const worker = new Worker(
  "userEventQueue",
  async (job) => {
    if (job.name === "userRegistered") {
      const { userId, name } = job.data;
      await workspaceService.createDefaultWorkspace(userId); // Buat workspace default
      console.log(
        `[WorkspaceWorker] Default workspace created for Personal User ${userId}`
      );
    }
  },
  {
    connection: redisClient.options,
  }
);

worker.on("failed", (job, err) => {
  console.error(`[WorkspaceWorker] Failed job ${job.id}`, err);
});

module.exports = worker;
