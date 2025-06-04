const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "workspace-service",
  brokers: ["kafka:9092"],
});

module.exports = kafka;
