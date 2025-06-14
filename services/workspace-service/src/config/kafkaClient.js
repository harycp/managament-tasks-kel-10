const { Kafka } = require("kafkajs");

const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092";

console.log(KAFKA_BROKER);

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "workspace-service",
  brokers: [KAFKA_BROKER],
});

module.exports = kafka;
