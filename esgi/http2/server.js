const http2 = require('http2');
const fs = require('fs');
const path = require('path');

// Lire les fichiers de certificat et de clé pour HTTPS
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

// Créer le serveur HTTP/2 sécurisé
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
    const reqPath = headers[':path'];

    if (reqPath === '/') {
        // Servir index.html
        stream.respondWithFile(path.join(__dirname, 'index.html'), {
            'content-type': 'text/html'
        });
    } else if (reqPath === '/style.css') {
        // Servir style.css
        stream.respondWithFile(path.join(__dirname, 'style.css'), {
            'content-type': 'text/css'
        });
    } else if (reqPath === '/script.js') {
        // Servir script.js
        stream.respondWithFile(path.join(__dirname, 'script.js'), {
            'content-type': 'application/javascript'
        });
    } else if (reqPath === '/time') {
        // Configurer les en-têtes pour SSE (sans l'en-tête 'connection')
        stream.respond({
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
            ':status': 200
        });

        const interval = setInterval(() => {
            if (stream.destroyed) {
                clearInterval(interval);
                return;
            }
            const data = `data: ${new Date().toLocaleTimeString()}\n\n`;
            stream.write(data);
        }, 1000);
    } else {
        stream.respond({
            ':status': 404
        });
        stream.end();
    }
});

server.listen(8443, () => {
    console.log('Serveur en écoute sur https://localhost:8443');
});
