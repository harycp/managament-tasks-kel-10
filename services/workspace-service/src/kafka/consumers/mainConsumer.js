const kafka = require("../../config/kafkaClient");
const { USER_EVENTS, BOARD_EVENTS } = require("../topic");
const workspaceService = require("../../services/workspaceService");
const workspaceMemberService = require("../../services/workspaceMemberService");

const consumer = kafka.consumer({ groupId: "workspace-service-group" });

const runMainConsumer = async () => {
  console.log("[Kafka Consumer] Connecting...");
  await consumer.connect();

  await consumer.subscribe({
    topics: [USER_EVENTS, BOARD_EVENTS],
    fromBeginning: false,
  });
  console.log(
    `[Kafka Consumer] Subscribed to topics: ${USER_EVENTS}, ${BOARD_EVENTS}`
  );

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const key = message.key.toString();
        const data = JSON.parse(message.value.toString());

        console.log(
          `[Kafka Consumer] Received message from topic "${topic}" with key "${key}"`
        );

        switch (topic) {
          case BOARD_EVENTS:
            if (key === "memberAddedToBoard") {
              const { userId, workspaceId, role } = data;
              await workspaceMemberService.addMemberById(
                workspaceId,
                userId,
                role
              );
            }
            break;

          case USER_EVENTS:
            if (key === "userRegistered") {
              const { userId } = data;
              await workspaceService.createDefaultWorkspace(userId);
              console.log(
                `[Kafka Consumer] Default workspace created for ${userId}`
              );
            }
            break;

          default:
            console.warn(`[Kafka Consumer] No handler for topic: ${topic}`);
            break;
        }
      } catch (error) {
        console.error(`[Kafka Consumer] Error processing message:`, error);
      }
    },
  });
};

module.exports = { runMainConsumer };
