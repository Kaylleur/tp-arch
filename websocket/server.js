const express = require('express');
const { createServer } = require('node:http');

const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);
const sockets = [];
const typing = {};
const realm = 'ynov';
const clientId = 'cours';
const clientSecret = '7hgsdoP5opIQQ5S8b9JQ9okV14bMAY3V';
//
// app.use(cookieParser());
// app.use(morgan('dev'));
// app.use(bodyParser.json());
//
// const checkAuth = async (req, res, next) => {
//   const response = await fetch(`http://localhost:8081/realms/${realm}/protocol/openid-connect/userinfo`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${req.headers.authorization}`
//     }
//   });
//   if (response.status >= 400) {
//     res.status(401).send('Unauthorized');
//     return;
//   }
//   next();
// };

app.get('/', (req, res) => {
  console.log('sendfile');
  return res.sendFile(__dirname + '/client.html');
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});


io.on('connection', (socket) => {
  io.to(socket.id).emit('users', sockets.map(s => s.username));


  io.on('join_channels', (channels) => {
    console.log('join_channels', channels);
    channels.forEach(channel => {
      socket.join(channel);
    });
  });
  //typing
  socket.on('im_typing', () => {
    const { channel, username } = sockets.find(s => s.socket === socket.id);
    const now = new Date();
    if (!typing[channel]) {
      typing[channel] = [];
    }
    typing[channel] = typing[channel].filter(t => t.socket !== socket.id);
    typing[channel].push({ username, now, socket: socket.id });

    typing[channel] = typing[channel].filter(t => t.now > now - 2000);
    // console.log(typing[channel]);
    // console.log(typing[channel].map(t => t.username));
    socket.to(channel).emit('is_typing', { usernames: typing[channel].map(t => t.username) });
  });

  //join channel
  socket.on('join', ({ username, channel }) => {
    console.log(username + ' joined ' + channel);
    const index = sockets.findIndex(s => s.socket === socket.id);
    if (index === -1) {
      sockets.push({
        socket: socket.id,
        username,
        channel
      });
    } else {
      socket.leave(sockets[index].channel);
      sockets[index].channel = channel;
    }
    socket.join(channel);
    io.to(socket.id).emit('users', sockets.map(s => s.username));
    socket.broadcast.emit('users', sockets.map(s => s.username));
    io.to(socket.id).emit('new_message', { username: 'Bot', message: 'You joined ' + channel });
    socket.to(channel).emit('new_message', { username: 'Bot', message: username + ' joined ' + channel });
  });

  // on dc
  socket.on('disconnect', (id) => {
    // console.log(socket.id);
    console.log('user disconnected');
    const userInfo = sockets.find(s => s.socket === socket.id);
    if (userInfo) {
      socket.broadcast.emit('new_message', { username: 'Bot', message: `${userInfo.username} has left the chat` });
      sockets.splice(sockets.findIndex(s => s.socket === socket.id), 1);
      socket.broadcast.emit('users', sockets.map(s => s.username));
    }
  });

  socket.on('chat_message', ({ to, message }) => {
    const userInfo = sockets.find(s => s.socket === socket.id);
    if (userInfo) {
      let channel = userInfo.channel;
      if (to !== 'channel') {
        const toInfo = sockets.find(s => s.username === to);
        channel = toInfo.socket; // send to private socket
      }
      socket.to(channel).emit('new_message', { username: userInfo.username, private: to !== 'channel', message });
    }
  });
});
//https://socket.io/get-started/chat#getting-this-example
