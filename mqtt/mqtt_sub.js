const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://127.0.0.1')

// console.log(client);
client.on('connect', () => {
  console.log('connected');
  client.subscribe('presence');
  client.subscribe('toto');
  client.on('message', (topic, message) => {
    console.log(`Message from ${topic}: ${message.toString()}`);
    // client.end()
  });
});
