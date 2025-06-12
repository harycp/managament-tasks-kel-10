const kafka = require("../../config/kafkaClient");
const { BOARD_EVENTS } = require("../topic");

const producer = kafka.producer();

const sendMemberAddedToBoardEvent = async (data) => {
  try {
    await producer.connect();
    await producer.send({
      topic: BOARD_EVENTS,
      messages: [
        {
          key: "memberAddedToBoard",
          value: JSON.stringify(data),
        },
      ],
    });
    console.log('[BoardService] Event "memberAddedToBoard" sent successfully.');
  } catch (error) {
    console.error("Failed to send memberAddedToBoard event:", error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = { sendMemberAddedToBoardEvent };
