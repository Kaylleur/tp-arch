const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client.html');
});

io.on('connection', (socket) => {
  socket.on('chat_message', (message) => {
    console.log('received msg', message);
    socket.broadcast.emit('new_message', message);
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
