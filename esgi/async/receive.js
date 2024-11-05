const dgram = require('dgram');

// receive message
const server = dgram.createSocket('udp4');
server.on('message', (msg, rinfo) => {
    console.log(`Message: ${msg} from ${rinfo.address}:${rinfo.port}`);
});


// Le serveur commence à écouter sur le port 12000
server.bind(12000, () => {
    console.log('Le serveur UDP écoute sur le port 12000');
});