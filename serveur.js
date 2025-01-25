
import {createServer} from 'node:http';
import express from 'express';
import { Server as SocketServer } from 'socket.io';
import { time } from 'node:console';

const app = express(); // <-- Création d'une application Express
const server = createServer(app); // <-- Utilisation de l'application Express
const io = new SocketServer(server); // <-- Création d'un serveur WebSocket

// Configuration de l'application Express
app.use(express.static('public')); // <-- Serveur de fichiers statiques

app.get('/', (req, res) => {
	res.redirect('/index.html'); // <-- Redirection vers la page d'accueil
});

server.listen(3000, () => { // <-- Démarrage du serveur
	console.log('Server is running on port 3000');
});

// Exemple de serveur Express avec un serveur HTTP


//////////////////////////////
io.on('connection', (socket) => {
	console.log(`Someone connected: ${socket.conn.remoteAddress}`);

    io.emit('system_message', {content : `Welcome to ${socket.conn.remoteAddress.replace('::ffff:', '')}`});

    socket.on("typing_start", () => {
        typingUsers.add(socket.conn.remoteAddress);
        io.emit('typing', Array.from(typingUsers));

    });

    socket.on("typing_stop", () => {
        typingUsers.delete(socket.conn.remoteAddress);
        io.emit('typing', Array.from(typingUsers));
    });

    socket.on('user_message_send', (data) => {
        console.log(`Message ${data.content}`);
        io.emit('user_message', {
            content : `${data.content}`,
            author : `${socket.conn.remoteAddress.replace('::ffff:', '')}`,
            time : `${new Date().toLocaleTimeString()}`,
            isMe : true
        },);

    });

    socket.on('disconnect', () => {
        console.log(`Someone disconnected: ${socket.conn.remoteAddress}`);

        io.emit('system_message', {content : `Goodbye to ${socket.conn.remoteAddress}:(`});
    });
});
////////////


