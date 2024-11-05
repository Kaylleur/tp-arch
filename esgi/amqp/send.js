#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://guest:guest@localhost', async (error0, connection) => {
    if (error0) {
        throw error0;
    }
    const channel = await connection.createChannel();
    channel.prefetch(1);
    const queue = 'sysA';

    channel.assertQueue(queue, {
        durable: false,
        exclusive: false
    }, (error2, q) => {
        if (error2) {
            throw error2;
        }

        let i = 0;
        setInterval(() => {
            i++;
            channel.sendToQueue(queue, Buffer.from(JSON.stringify({i})));
        }, 1000);

    });
});