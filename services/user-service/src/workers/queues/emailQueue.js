const { Queue } = require("bullmq");
const redisClient = require("../../utils/redisClient");

const emailQueue = new Queue("emailQueue", {
  connection: redisClient.options,
});

module.exports = emailQueue;
