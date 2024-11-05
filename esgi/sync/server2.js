const net = require('net');
const con = net.createConnection(9000, '127.0.0.1', () => {
  console.log('connected to server!');
  setInterval(() => {
    con.write('world!');
  }, 2000);

  // con.end();
});
con.on('end', () => {
  console.log('disconnected from server');
});
