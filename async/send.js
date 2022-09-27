const dgram = require('dgram');

const client = dgram.createSocket('udp4');
client.send('Hello World!', 0, 12, 12000, '127.0.0.1', (err, bytes) => {
  console.log(err);
  console.log(bytes);
  client.close();
});


// sudo tcpdump -i lo -n udp port 12000
