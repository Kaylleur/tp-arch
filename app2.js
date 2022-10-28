const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
app.use(bodyParser.text());
app.use(morgan('dev'));


app.get('/api/users', (req, res) => {
  // console.log(req.query);
  // console.log(req.method);
  // console.log(req.hostname);
  // console.log(req.headers)
  res.setHeader('Cache-control', 'max-age=10');
  res.status(200).send([{id:1, name:'toto'}, {id:2, name: 'tata'}]);
});

app.post('/api/users', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log(req.body);
  console.log(req.headers.authorization);
  res.setHeader('Cache-control', 'max-age=10');
  res.status(204).send();
})

app.listen(3000, () => {
  console.log('App is litenning');
})

