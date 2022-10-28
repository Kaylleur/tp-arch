const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://127.0.0.1:1883');

client.on('connect', () => {
  console.log('connected');
  client.publish('presence', 'hello!', {
    qos:0
  });
  client.publish('toto', 'hello!', {
    qos:0
  });
  client.end()
})

