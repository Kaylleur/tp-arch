const quic = require('node:quic');
const fs = require('fs');

// Chargement des clés et certificats
const key = fs.readFileSync('server-key.pem');
const cert = fs.readFileSync('server-cert.pem');

// Création du socket QUIC
const server = quic.createSocket({ endpoint: { port: 1234 } });

// Gestion des sessions entrantes
server.on('session', (session) => {
    console.log('Nouvelle session établie');

    // Gestion des flux de données
    session.on('stream', (stream) => {
        console.log('Nouveau flux de données');
        stream.on('data', (data) => {
            console.log(`Reçu du client: ${data}`);
        });

        // Envoi d'une réponse au client
        stream.write('Bonjour depuis le serveur!');
        stream.end();
    });
});

// Démarrage du serveur
(async () => {
    try {
        await server.listen({ key, cert, alpn: 'quic-echo-example' });
        console.log('Le serveur QUIC écoute sur le port 1234');
    } catch (err) {
        console.error('Erreur lors du démarrage du serveur QUIC:', err);
    }
})();
