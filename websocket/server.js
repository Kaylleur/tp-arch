const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const channels = {};

app.use(morgan('dev'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client.html');
});

app.post('/api/gitlab', (req, res) => {
  console.log(req.body);
  io.emit('gitlab_event', req.body);
  res.status(204).send();
});

io.on('connection', (socket) => {
  socket.on('chat_message', (message) => {
    const chan = channels[socket.id];
    if(chan){
      socket.to(chan).emit('new_message', message);
    }
  });
  socket.on('set_channel', (channel) => {
    const oldChan = channels[socket.id];
    if(oldChan){
      socket.leave(oldChan);
    }
    socket.join(channel);
    channels[socket.id]= channel;

    console.log(channels);
  });
});
//https://socket.io/get-started/chat#getting-this-example

server.listen(3000, () => {
  console.log('listening on *:3000');
});
