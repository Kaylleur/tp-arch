const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const websocketServerAddr= 'http://localhost:3000';


app.use(morgan('dev'));
app.use(bodyParser.json());


app.post('/api/notifications', async (req,res) => {
  console.log('sending notification to websocket server with data: ', req.body);
    const result = await fetch(websocketServerAddr + '/api/send', {
        method: 'POST',
        body: JSON.stringify({
          username: req.body.username,
          message: req.body.message,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Toto',
        }
    })
  res.status(204).send();
});


app.listen(3001, () => {
  console.log('listening on port 3001');
});
