const fs = require('fs');

function randomString(length, chars){
  if(!length) length = 20;
  if(!chars) chars = 'abcdefghijklmnopqrstuvxyz0123456789';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}


const users = [];


for (let i = 0; i < 10000; i++) {
  users.push({
    id: i,
    name: randomString(10, 'abcdefghijklmnopqrstuvwxyz-'),
    createdAt: new Date(),
    password: randomString(30)
  })
}

fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
