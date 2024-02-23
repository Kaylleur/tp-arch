#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
let count = 0;

amqp.connect('amqp://user:password@localhost', async (error0, connection) => {
  if (error0) {
    throw error0;
  }
  await connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = 'sysA';

    const exchange = 'events-discord';

    channel.assertExchange(exchange, 'direct', '');
    channel.prefetch(1);

    channel.assertQueue(queue, {
      durable: false,
      exclusive: false
    }, (error2, q) => {
      if (error2) {
        throw error2;
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
        },2000);
      }, {
        noAck: false
      });
    });
  });
});
