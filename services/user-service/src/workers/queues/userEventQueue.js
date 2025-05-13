const { Queue } = require("bullmq");
const redisClient = require("../../utils/redisClient");

const userEventQueue = new Queue("userEventQueue", {
  connection: redisClient.options,
});

module.exports = userEventQueue;
