const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Broadcast incoming messages to all other clients
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });

    // receptionner l'evenement le renvoyer aux autres

    // Log when a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on port 3000
http.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
