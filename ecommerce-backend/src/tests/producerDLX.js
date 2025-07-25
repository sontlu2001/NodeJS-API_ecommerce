const amqplib = require("amqplib");

const RABBITMQ_CONNECT_STRING = process.env.RABBITMQ_CONNECT_STRING|| "";
console.log(`RABBITMQ_CONNECT_STRING from env: ${process.env.RABBITMQ_CONNECT_STRING}`);

const runProducer = async () => {
  try {
    const connection = await amqplib.connect(RABBITMQ_CONNECT_STRING);
    const channel = await connection.createChannel();
    
    const notificationExchange = 'notification_exchange';
    const notiQueue = 'notification_queue';
    const notificationExchangeDLX = 'notification_exchange_dlx';
    const notificationRoutingKeyDLX = 'notification_routing_key_dlx';

    //1. Declare the exchange
    await channel.assertExchange(notificationExchange, 'direct', { durable: true });
    //2. Declare the queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phep nhieu consumer ket noi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    });
    //3. Bind the queue to the exchange
    await channel.bindQueue(queueResult.queue, notificationExchange);
    //4. Publish a message to the exchange
    const message = 'New a product ';
    console.log(`Sending message: ${message}`);
    await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: '10000', // 10 seconds
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('Error in producer:', error);
  }
}

runProducer()
  .then((rs) => console.log('Producer finished', rs))
  .catch(error => console.error('Producer error:', error));

// RABBITMQ_CONNECT_STRING="" node producerDLX.js