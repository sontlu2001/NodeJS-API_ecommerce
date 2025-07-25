'use strict';

const { set } = require('lodash');
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
  },
  // case processing
  consumerToQueueNomal: async (queueName) => {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      const notiQueue = 'notification_queue';

      setTimeout(() => {
        channel.consume(notiQueue, async (msg) => {
          console.log(`consumerToQueueNomal received message: ${msg.content.toString()}`);
          channel.ack(msg);
        });
      }, 15000);

    } catch (error) {
      console.error("Error in consumerToQueueNomal:", error);
      throw error;
    }
  },

  // case failed
  consumerToQueueFailed: async (queueName) => {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      const notificationExchangeDLX = 'notification_exchange_dlx';
      const notificationRoutingKeyDLX = 'notification_routing_key_dlx';
      const notiQueueHandler = 'notification_queue_hot_fix';

      await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true });
      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false
      });

      await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);
      channel.consume(queueResult.queue, async (msg) => {
        console.log(`consumerToQueueFailed received failed message, pls hot fix: ${msg.content.toString()}`);
      }, { noAck: true });

    } catch (error) {
      console.error("Error in consumerToQueueFailed:", error);
      throw error;
    }
  }
}

module.exports = messageService;