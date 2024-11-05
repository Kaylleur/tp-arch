#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
let i = 0;

amqp.connect('amqp://guest:guest@localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const exchange = 'direct_logs';
        const routingKey = 'info';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });
        setInterval(() => {
            i++;
            channel.publish(exchange, routingKey, Buffer.from(`Hello ${i}`));
            console.log(" [x] Sent %s: '%s'", routingKey, `Hello ${i}`);
        }, 1000);
    });

    // setTimeout(function() {
    //     connection.close();
    //     process.exit(0)
    // }, 500);
});