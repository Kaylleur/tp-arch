const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const realm = 'ynov';
const keycloakUrl = `http://localhost:8081/realms/${realm}/protocol/openid-connect`;
const clientId = 'cours';
const clientSecret = 'BYt8TZSyGppvvWNtJFdw4rHDCVGkBLv0';

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());

const isAuthorized = (roles) => {
  return async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if(!accessToken) {
      return res.status(401).send({message: 'Unauthorized'});
    }
    const decodedToken = accessToken.split('.')[1] ? JSON.parse(atob(accessToken.split('.')[1])) : null;
    if(!decodedToken) {
      return res.status(401).send({message: 'Unauthorized'});
    }
    const active = await checkToken(accessToken);
    if(!active) {
      return res.status(401).send({message: 'Unauthorized'});
    }
    // console.log(decodedToken.resource_access[clientId].roles);
    // console.log(roles);
    if(decodedToken.resource_access[clientId].roles.every(role => !roles.includes(role))) {
      return res.status(403).send({message: 'Forbidden'});
    }

    next();
  };
}

const checkToken = async (token) => {
  const response = await fetch(keycloakUrl + '/token/introspect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `client_id=${clientId}&client_secret=${clientSecret}&token=${token}`
  });
  const body = await response.json();
  // console.log(body);
  return body.active;
}

const decodeJWT = (token) => {
  return token.split('.')[1] ? JSON.parse(atob(token.split('.')[1])) : null;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Trying to login with', username, password);
  const response = await fetch(keycloakUrl + '/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=password&username=${username}&password=${password}`
  });
  const body = await response.json();
  if(response.status === 200) {
    res.cookie('access_token', body.access_token);
    res.cookie('refresh_token', body.refresh_token);
    res.status(200).send(decodeJWT(body.access_token));
  }else {
    res.status(401).send({message: 'Invalid credentials' });
  }
});


app.get('/api/users', isAuthorized(['users']) , (req, res) => {
  res.send({message: 'Hello from the users API'});
});

app.get('/api/admin',isAuthorized(['admins']) , (req, res) => {
  res.send({message: 'Hello from the admins API'});
});

app.get('/api/both',isAuthorized(['admins', 'users']) , (req, res) => {
  res.send({message: 'Hello from the both API'});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
