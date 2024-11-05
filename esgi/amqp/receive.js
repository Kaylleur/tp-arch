#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
let count = 0;

amqp.connect('amqp://guest:guest@localhost', async (error0, connection) => {
  if (error0) {
    throw error0;
  }
  await connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'sysA';
    channel.prefetch(1);

    channel.assertQueue(queue, {
      durable: false,
      exclusive: false
    }, (error2, q) => {
      if (error2) {
        throw error2;
      }
      channel.consume(queue, (msg) => {
        count++;
        console.log(" [x] %s", msg.content.toString());
      },{
        noAck: true
      });
    });
    console.log('Listening to queue sysA');
  });
});
