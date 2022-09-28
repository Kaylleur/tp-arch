const express = require('express');
// const { MongoClient } = require('mongodb');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const users = require('./users.json');
const app = express();
const port = 3001;


// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url, { useUnifiedTopology: true, writeConcern: 1 });
// const dbName = 'tp1';

async function main() {
  const reqBySessions = [];
  // Use connect method to connect to the server
  // await client.connect();
  // console.log('Connected successfully to server');
  // const db = client.db(dbName);
  // const collection = db.collection('documents');

  // the following code examples can be pasted here...

  app.set('views', './views');
  app.set('view engine', 'ejs');
  app.use(morgan('dev'));
  app.use(cookieParser());

  app.use((req, res, next) => {
    const now = new Date();
    let session = reqBySessions.find(s => s.id === req.cookies.sessionId); // session exist ?
    if (!session  || !req.cookies.sessionId) {
      const sessionId = req.cookies.sessionId || randomString(300);
      res.cookie('sessionId', sessionId);
      session = { id: sessionId, createdAt: new Date(), reqs: [] };
      reqBySessions.push(session);
    }
    session.reqs.push({req: req.path, date: now});
    session.reqs = session.reqs.filter(r => now.getTime() - r.date.getTime() < 5000);

    const reqsOnSameUrl = session.reqs.filter(r => r.req === req.path && now.getTime() - r.date.getTime() < 1000);

    console.log(reqsOnSameUrl.length + 'req/s');
    if(reqsOnSameUrl.length > 20 ){
      console.warn('rate limit');
      res.status(429).send({msg: 'rate limit', status: 429});
    }else {
      next();
    }
  });


  app.get('/', (req, res) => {/* GET home page. */
    res.render('index', { title: 'Express' });
  });
  app.get('/hello', (req, res) => {/* GET home page. */
    res.render('index', { title: 'Hello' });
  });

  app.get('/users', (req, res) => {
    let limit = +req.query.limit || 20;
    limit = limit > 1000 ? 20 : limit;
    const skip = +req.query.skip || 0;
    res.send(users.slice(skip, skip + limit));
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
