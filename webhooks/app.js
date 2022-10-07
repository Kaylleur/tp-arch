const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/api/gitlab', (req, res) => {
  console.log(req.body);
  res.send('ok');
});

app.listen(3000, () => {
  console.log('listenning on 3000');
});
