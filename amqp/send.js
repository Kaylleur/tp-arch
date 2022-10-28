const amqp = require('amqplib/callback_api');
amqp.connect('amqp://user:password@localhost', function(error0, connection) {
  console.log('connected');
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'thomasb'
    const exchange = 'events-discord';

    channel.assertExchange(exchange, 'fanout', '');

    let i = 0;
    setInterval( () => {
      i++;
      // channel.sendToQueue(queue,Buffer.from(JSON.stringify({i})));
      channel.publish(exchange, '',Buffer.from(JSON.stringify({i})));
      console.log(" [x] Sent %s", i);
    }, 1000);

  });
});
