#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
let count = 0;

const AMQP_URL = process.env.AMQP_URL;
const queue = process.env.AMQP_QUEUE;
const exchange = process.env.AMQP_EXCHANGE;
if(!AMQP_URL) {
  console.log('AMQP_URL is not set');
  process.exit(1);
}
if(!queue) {
  console.log('AMQP_QUEUE is not set');
  process.exit(1);
}
if(!exchange) {
  console.log('AMQP_EXCHANGE is not set');
  process.exit(1);
}
amqp.connect(AMQP_URL, async (error0, connection) => {
  if (error0) {
    console.error(error0);
    process.exit(1);
  }
  await connection.createChannel(function(error1, channel) {
    if (error1) {
      console.error(error1);
      process.exit(1);
    }


    channel.assertExchange(exchange, 'direct', '');
    channel.prefetch(1);

    channel.assertQueue(queue, {
      durable: false,
      exclusive: false
    }, (error2, q) => {
      if (error2) {
        console.error(error2);
        process.exit(1);
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');
      console.log(' [*] Binding to exchange: %s', exchange);
      channel.consume(q.queue, (msg) => {
        count++;
        console.log(" [x] %s", msg.content.toString());
        setTimeout(() => {
          channel.ack(msg);
          console.log(" [x] Done %s", msg.content.toString());
          console.log(" [x] Total %s", count);
        },Math.floor(Math.random() * 100));
      }, {
          noAck: false
      });
    });
  });
});
