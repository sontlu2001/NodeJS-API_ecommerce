"use strict";
const amqplib = require("amqplib");

async function producerOrderedMessage() {
  const connection = await amqplib.connect("amqp://son-dev:son123456@103.146.22.246:5672");
  const channel = await connection.createChannel();

  const queueName = "ordered_queue_message";
  await channel.assertQueue(queueName, { durable: true });


  for (let i = 0; i < 10; i++) {
    const msg = `Ordered message ${i + 1}`;
    console.log(`Sending: ${msg}`);
    channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
}

producerOrderedMessage()
  .then(() => console.log("Producer messages sent successfully"))
  .catch((error) => console.error("Error sending ordered messages:", error));
