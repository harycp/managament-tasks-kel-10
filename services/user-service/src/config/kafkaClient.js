const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "user-service",
  brokers: ["localhost:9092"],
});

module.exports = kafka;
