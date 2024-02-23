const fs = require('fs');
const mongo = require('mongodb').MongoClient;


function randomString(length, chars){
  if(!length) length = 20;
  if(!chars) chars = 'abcdefghijklmnopqrstuvxyz0123456789';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}


// function that should take randomly N fruits in the array
function randomFruits() {
  const fruits = ["Apple", "Pineapple", "Peach", "Strawberry"];
  const res = [];
  const nbFruits = Math.floor(Math.random() * fruits.length);
  for (let i = 0; i < nbFruits; i++) {
    res.push(fruits[Math.floor(Math.random() * fruits.length)]);
  }
  return res;
}

//func that should take a random city in the list
function randomCity() {
  const cities = ["Paris", "London", "New York", "Tokyo"];
  return cities[Math.floor(Math.random() * cities.length)];
}

//function random date between now and last 6 month
function randomDate() {
  const date = new Date();
  const randomMonth = Math.floor(Math.random() * 6);
  date.setMonth(date.getMonth() - randomMonth);
  return date;
}

//function that return a list of books with title, author, readat
function randomBooks() {
  const books = [];
  const nbBooks = Math.floor(Math.random() * 10);
  for (let i = 0; i < nbBooks; i++) {
    books.push({
      title: randomString(),
      readAt: randomDate(),
      author: randomString(),
    });
  }
  return books;
}

const users = [];


for (let i = 0; i < 10000; i++) {
  users.push({
    id: i,
    name: randomString(10, 'abcdefghijklmnopqrstuvwxyz-'),
    createdAt: new Date(),
    password: randomString(30),
    fruits: randomFruits(),
    details: {
      age: Math.floor(Math.random() * 100),
      address: {
        street: randomString(10, 'abcdefghijklmnopqrstuvwxyz-'),
        city: randomCity(),
        zip: Math.floor(Math.random() * 10000),
      },
    },
    books: randomBooks(),
  })
}

mongo.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  const db = client.db('toto');
  db.collection('users').insertMany(users, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result);
    client.close();
  });
});

// fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
