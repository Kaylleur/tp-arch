const dgram = require('dgram');

const client = dgram.createSocket('udp4');
client.send('toto', 0, 4, 12000, '10.31.33.216', (err, bytes) => {
  console.log(err);
  console.log(bytes);
  client.close();
});

// sudo tcpdump -i lo -n udp port 12000
