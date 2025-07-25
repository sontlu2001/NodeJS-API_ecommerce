'use strict';

const {
  connectToRabbitMQ,
  consumerQueue
} = require('../dbs/init.rabbit');

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
      // Keep the connection open for consuming messages
      return { connection, channel };
    } catch (error) {
      console.error("Error in consumerToQueue:", error);
      throw error;
    }
  }
}

module.exports = messageService;