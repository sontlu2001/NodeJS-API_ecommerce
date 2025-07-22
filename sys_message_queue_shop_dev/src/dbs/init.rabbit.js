"use strict";

const amqp = require("amqplib");
require("dotenv").config();

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || "5672";
const RABBITMQ_USER = process.env.RABBITMQ_USER || "guest";
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || "guest";
const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
console.log(`Connecting to RabbitMQ at ${RABBITMQ_URL}`);

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    if (!connection) {
      throw new Error("Failed to connect to RabbitMQ");
    }

    const channel = await connection.createChannel();
    console.log(`Connected to RabbitMQ is ready.`);

    return { connection, channel };
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const {connection, channel} = await connectToRabbitMQ();

    //Publish a test message
    const queue = "test_queue";
    const message =  "Hello RabbitMQ!";

    await channel.assertQueue(queue)
    await channel.sendToQueue(queue, Buffer.from(message));

    //close the connection
    await connection.close();

  } catch (error) {
    console.error("Error during RabbitMQ test connection:", error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest
};
