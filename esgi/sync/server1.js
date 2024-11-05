const net = require('net');
const server = net.createServer();

server.on('connection', conn => {
  conn.setEncoding('utf8');
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.on('data', (d) => {
    console.log('connection data from %s: %j', remoteAddress, d);
  });

  conn.once('close', () => {
    console.log('connection from %s closed', remoteAddress);
  });
  conn.on('error', (err) => {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });

});

server.listen(9000, '127.0.0.1',() => {
  console.log('server listening to %j', server.address());
});
