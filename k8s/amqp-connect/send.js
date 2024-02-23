const amqp = require('amqplib/callback_api');

const AMQP_URL = process.env.AMQP_URL;

const exchange = process.env.AMQP_EXCHANGE;

if (!AMQP_URL) {
  console.log('AMQP_URL is not set');
  process.exit(1);
}
if (!exchange) {
  console.log('AMQP_EXCHANGE is not set');
  process.exit(1);
}
amqp.connect(AMQP_URL, function(error0, connection) {
  console.log('connected');
  if (error0) {
    console.error(error0);
    process.exit(1);
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      console.error(error1);
      process.exit(1);
    }


    channel.assertExchange(exchange, 'direct', '');
    console.log('Exchange asserted %s', exchange);

    let i = 0;
    setInterval(() => {
      i++;
      // channel.sendToQueue(queue,Buffer.from(JSON.stringify({i})));
      channel.publish(exchange, '', Buffer.from(JSON.stringify({ i })));
      console.log(' [x] Sent %s', i);
    }, 100);

  });
});
