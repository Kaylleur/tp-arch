const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const sockets = [];
const typing = {};


const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8081';
const realm = process.env.REALM;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());

const checkAuth = async (req, res, next) => {
  const response = await fetch(keycloakUrl`/realms/${realm}/protocol/openid-connect/userinfo`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${req.headers.authorization}`
    }
  });
  if (response.status >= 400) {
    res.status(401).send('Unauthorized');
    return;
  }
  next();
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});

app.post('/api/gitlab', (req, res) => {
  console.log(req.headers);
  if(req.headers['x-gitlab-token'] !== 'toto'){
    return res.status(401).send();
  }
  console.log(req.body);
  res.status(204).send();
});

app.get('/callback', async (req, res) => {
  console.log('callback from keycloak ' + req.query.code);
  if (req.query.code) {
    const response = await fetch(keycloakUrl + `/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=http://localhost:3000/callback`
    });
    if (response.status >= 400) {
      res.status(401).send('Unauthorized');
      return;
    }
    const data = await response.json();
    console.log('data', data);
    const accessTokenExpire = new Date();
    accessTokenExpire.setSeconds(accessTokenExpire.getSeconds() + data.expires_in);
    const refreshTokenExpire = new Date();
    refreshTokenExpire.setSeconds(refreshTokenExpire.getSeconds() + data.refresh_expires_in);

    res.cookie('access_token', data.access_token, {
      expires: accessTokenExpire
    });
    res.cookie('refresh_token', data.refresh_token, {
      expires: refreshTokenExpire
    });
  }
  res.redirect('/');
});


app.get('/api/me', async (req, res) => {
  // console.log(req.headers.authorization);
  if (!req.headers.authorization || !req.headers.authorization.split(' ').length > 1) {
    console.debug('No token provided or malformed');
    res.status(401).send();
    return;
  }
  //should request user info from bearer token to keycloak
  const response = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/token/introspect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `client_id=${clientId}&client_secret=${clientSecret}&token=${req.headers.authorization.split(' ')[1]}`
  });
  // console.log(response.status);
  const data = await response.json();
  console.log(data);
  if (response.status >= 400 || !data.active) {
    res.status(401).send();
    return;
  }
  res.status(200).send(data);
});

app.post('/api/refreshToken', async (req, res) => {
  const { refreshToken } = req.body;
  const response = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `client_id=${clientId}&grant_type=refresh_token&refresh_token=${refreshToken}`
  });
  if (response.status >= 400) {
    res.cookie('access_token', '', { httpOnly: true });
    res.cookie('refresh_token', '', { httpOnly: true });
    res.status(401).send();
    return;
  }
  const data = await response.json();

  res.cookie('access_token', data.access_token, { httpOnly: true, maxAge: 1000 * data.expires_in });
  res.cookie('refresh_token', data.refresh_token, { httpOnly: true, maxAge: 1000 * data.refresh_expires_in });
  res.status(200).send(data);
});

io.on('connection', (socket) => {
  io.to(socket.id).emit('users', sockets.map(s => s.username));
  io.to(socket.id).emit('configuration', { keycloakUrl, realm, clientId });


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

server.listen(3000, () => {
  console.log('listening on *:3000');
});
