"use strict";
const amqplib = require("amqplib");

async function consumerOrderedMessage() {
  const connection = await amqplib.connect("amqp://son-dev:son123456@103.146.22.246:5672");
  const channel = await connection.createChannel();

  const queueName = "ordered_queue_message";
  await channel.assertQueue(queueName, { durable: true });

  // set prefetch to 1 to ensure messages are processed one at a time
  channel.prefetch(1); // Process one message at a time
  channel.consume(
    queueName,
    (msg) => {
      const message = msg.content.toString();

      setTimeout(() => {
        console.log(`Received: ${message}`);
        channel.ack(msg);
      }, Math.random() * 1000); // Simulate processing time
    }
  );

}

consumerOrderedMessage()
  .then(() => console.log("Ordered messages sent successfully"))
  .catch((error) => console.error("Error sending ordered messages:", error));
