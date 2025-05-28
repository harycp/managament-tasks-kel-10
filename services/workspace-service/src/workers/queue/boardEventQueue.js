const { Queue } = require("bullmq");
const redisClient = require("../../utils/redisClient");

const boardEventQueue = new Queue("boardEventQueue", {
  connection: redisClient.options,
});

module.exports = boardEventQueue;
