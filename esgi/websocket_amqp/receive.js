const amqp = require('amqplib');

(async () => {
    const connection = await amqp.connect('amqp://guest:guest@localhost');
    const channel = await connection.createChannel();
    const queueInput = 'input';
    const queueOutput = 'output';

    await channel.assertQueue(queueInput, { durable: true });
    await channel.assertQueue(queueOutput, { durable: true });

    console.log(`Waiting for messages in the queue ${queueInput}...`);

    channel.consume(queueInput, (msg) => {
        // sleep 2 sec before sending the message
        setTimeout(() => {
            console.log(`Received message: ${msg.content.toString()}`);
            channel.sendToQueue(queueOutput, Buffer.from(msg.content.toString()));
            console.log(`Sent message to ${queueOutput}: ${msg.content.toString()}`);
            channel.ack(msg);
            console.log('acking msg');
        }, 2000);
    }, { noAck: false });

})();