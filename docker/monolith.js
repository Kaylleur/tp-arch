const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');

async function main() {

  // should connect to a mongo using env
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
  const mongo = new MongoClient(mongoUrl, { useUnifiedTopology: true });
  await mongo.connect();

  app.set('views', './views');

  app.set('view engine', 'ejs');
  app.use(morgan('dev'));
  app.use(cookieParser());

  const rngString = randomString(20);

  app.get('/api/mongo', async (req, res) => {
    const result = await mongo.db("admin").command({ ping: 1 });
    res.send({
      mongo: {
        status: result.ok > 0
      },
    })
  });

  app.get('/api/random', (req, res) => {
    res.render('index', { title: rngString });
  });

  app.get("/api/data", (req,res) => {
    res.send({data: rngString});
  });

  app.get('/api/index', (req, res) => {
    res.render('index', { title: process.env.TITLE });
  });


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  return 'Started';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally();


function randomString(length, chars) {
  if (!length) length = 20;
  if (!chars) chars = 'abcdefghijklmnopqrstuvxyz0123456789';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}
