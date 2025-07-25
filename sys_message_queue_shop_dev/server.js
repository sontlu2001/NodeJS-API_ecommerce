'use strict';

const { 
  consumerToQueue,
  consumerToQueueNomal,
  consumerToQueueFailed 
} = require('./src/services/consumerQueue.service');

const queueName = 'test_queue';

// consumerToQueue(queueName)
//   .then(() => {
//     console.log(`Message consumer started ${queueName}`);
//   })
//   .catch((error) => {
//     console.error('Error starting consumer:', error);
//   });

consumerToQueueNomal(queueName)
  .then(() => {
    console.log(`Message consumerToQueueNomal started ${queueName}`);
  })
  .catch((error) => {
    console.error('Error starting consumerToQueueNomal:', error);
  });

consumerToQueueFailed(queueName)
  .then(() => {
    console.log(`Message consumerToQueueFailed started ${queueName}`);
  })
  .catch((error) => {
    console.error('Error starting consumerToQueueFailed:', error);
  });