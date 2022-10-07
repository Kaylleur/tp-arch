const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://127.0.0.1:1883', {
  protocolVersion:5,
})

client.on('connect', () => {
  console.log('connected');
  client.publish('presence', 'hello!', {

  })

  client.end()
})

