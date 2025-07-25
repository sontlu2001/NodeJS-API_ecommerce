'use strict';

const { consumerToQueue } = require('./src/services/consumerQueue.service');

const queueName = 'test_queue';

consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer started ${queueName}`);
  })
  .catch((error) => {
    console.error('Error starting consumer:', error);
  });