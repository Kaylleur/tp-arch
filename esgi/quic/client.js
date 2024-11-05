const quic = require('node:quic');
const fs = require('fs');

// Chargement du certificat du serveur (pour la vérification)
const ca = fs.readFileSync('server-cert.pem');

// Création du socket QUIC
const client = quic.createSocket({ endpoint: { port: 0 } }); // Port 0 pour laisser le système choisir un port libre

(async () => {
    try {
        // Connexion au serveur QUIC
        const session = await client.connect({
            address: 'localhost',
            port: 1234,
            alpn: 'quic-echo-example',
            servername: 'localhost',
            ca, // Certificat du serveur pour la vérification
        });

        console.log('Connecté au serveur QUIC');

        // Ouverture d'un flux de données
        const stream = await session.openStream();

        // Envoi de données au serveur
        stream.write('Bonjour depuis le client!');

        // Réception de la réponse du serveur
        stream.on('data', (data) => {
            console.log(`Reçu du serveur: ${data}`);
        });

        stream.end();
    } catch (err) {
        console.error('Erreur lors de la connexion au serveur QUIC:', err);
    }
})();
