const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const sockets = {};

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/example.html');
});

io.on('connection', (socket) => {
  console.log('new connection: ' + socket.id);

  socket.on('join_channel', channel => {
    console.log(channel);
    sockets[socket.id] = {
      channel
    };
    socket.join(channel);
  });

  socket.on('chat_message', message => {
    console.log(message);
    const channel = sockets[socket.id].channel;
    socket.to(channel).emit('new_message', message);
  });
  // io.to(currentChannel).emit('new_message', 'new user connected');
});
//https://socket.io/get-started/chat#getting-this-example

server.listen(3000, () => {
  console.log('listening on *:3000');
});
