const net = require('net');
const con = net.createConnection(9000, '127.0.0.1', () => {

  console.log('connected to server!');
  con.write('world!\r\n');
});
con.on('data', (data) => {
  console.log(data.toString());
  con.end();
});
con.on('end', () => {
  console.log('disconnected from server');
});
