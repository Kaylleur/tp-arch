const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());

const decodeJWT = (token) => {
  return token.split('.')[1] ? JSON.parse(atob(token.split('.')[1])) : null;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Trying to login with', username, password);
  res.status(401).send({message: 'Invalid credentials' });
});


app.get('/api/users' , (req, res) => {
  res.send({message: 'Should be authorized only for users'});
});

app.get('/api/admin' , (req, res) => {
  res.send({message: 'Should be authorized only for admins'});
});

app.get('/api/both' , (req, res) => {
  res.send({message: 'Should be authorized for both users and admins'});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
