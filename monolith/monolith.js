const express = require('express')
// const { MongoClient } = require('mongodb');
const morgan = require('morgan');
const app = express()
const port = 3001


// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url, { useUnifiedTopology: true, writeConcern: 1 });
// const dbName = 'tp1';

async function main() {
  // Use connect method to connect to the server
  // await client.connect();
  // console.log('Connected successfully to server');
  // const db = client.db(dbName);
  // const collection = db.collection('documents');

  // the following code examples can be pasted here...

  app.set('views', './views');
  app.set('view engine', 'ejs');
  app.use(morgan('dev'))

  app.get('/', (req, res) => {/* GET home page. */
    res.render('index', { title: 'Express' });
  })
  app.get('/hello', (req, res) => {/* GET home page. */
    res.render('index', { title: 'Hello' });
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  return 'Started'
}
main()
  .then(console.log)
  .catch(console.error)
  .finally();
