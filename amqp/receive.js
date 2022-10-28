#!/usr/bin/env node

var amqp = require('amqplib/callback_api');


amqp.connect('amqp://user:password@localhost', async (error0, connection) => {
  if (error0) {
    throw error0;
  }
  await connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = '';

    const exchange = 'events-discord';

    channel.assertExchange(exchange, 'fanout', '');

    channel.assertQueue(queue, {
      durable: false,
      exclusive: true
    }, (error2, q) => {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');
      channel.consume(q.queue, (msg) => {
        console.log(" [x] %s", msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
});
