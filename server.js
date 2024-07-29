const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const express = require('express');

// Create an Express application
const app = express();
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle WebSocket connections
wss.on('connection', ws => {
    console.log('New WebSocket connection established');

    // Broadcast messages to all connected clients
    ws.on('message', message => {
        console.log(`Received message: ${message}`);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.send(JSON.stringify({ username: 'Server', text: 'Welcome to the chat!' }));
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
