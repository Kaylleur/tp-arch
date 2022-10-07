const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://127.0.0.1:1883')

// console.log(client);
client.on('connect', () => {
  console.log('connected');
  client.subscribe('presence')
  client.on('message', function(topic, message) {
    // message is Buffer
    console.log(message.toString())
    // client.end()
  })
})
