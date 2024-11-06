const dgram = require('dgram');

// sudo tcpdump -i lo -n udp port 12000

const client = dgram.createSocket('udp4');
setInterval(() => {

client.send('toto', 0, 4, 12000, 'localhost', (err, bytes) => {
  // console.log(err);
  console.log(bytes);
});

}, 2000);