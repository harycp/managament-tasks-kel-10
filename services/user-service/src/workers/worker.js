const { Worker } = require("bullmq");
const redisClient = require("../utils/redisClient");
const emailProcessor = require("./processors/emailProcessor");

const emailWorker = new Worker("emailQueue", emailProcessor, {
  connection: redisClient.options,
});

emailWorker.on("completed", (job) => {
  console.log(`[EmailWorker] Completed job ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`[EmailWorker] Failed job ${job.id}`, err);
});
