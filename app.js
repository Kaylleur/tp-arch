const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const users = require('./users.json');
//
app.use(bodyParser.json());
app.use(morgan('dev'));

const reqs = [];

app.use((req, res, next) => {
  reqs.push(req.path);
  console.log('toto');
  console.log(reqs);
  next();
});

app.get('/api/users', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // console.log(req.query);
  // console.log(req.path);
  // console.log(req.protocol);
  // console.log(req.headers);
  // console.log(req.method);
  res.status(200).send(users);
});

app.post('/api/users', (req, res) => {
  console.log(req.body);
  res.status(204).send();
});


app.listen(3000, () => {
  console.log('App is litenning');
});
