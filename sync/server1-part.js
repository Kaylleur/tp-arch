const net = require('net');
const server = net.createServer();

server.on('connection', conn => {

});

server.listen(9000, '127.0.0.1',() => {});
