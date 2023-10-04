const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:3000',
        methods: ['GET', 'POST'],
    },
});

const users = {};

io.on('connection', (socket) => {
    const userName = socket.handshake.query.name;
    users[socket.id] = userName;
    console.log(Object.keys(users));

    socket.broadcast.emit('user joined room', `${userName} joined the chat`);

    io.emit('connected users', users);

    socket.on('send room message', (msgObj) => {
        socket.broadcast.emit('room message', msgObj);
    });

    socket.on('send private message', (msgObj) => {
        const targetSocketId = msgObj.targetSocketId;
        if (targetSocketId) {
            io.to(targetSocketId).emit('private message', {
                user: users[targetSocketId],
                message: msgObj.message,
                time: msgObj.time
            });
        } else {
            console.log('User not found:', targetSocketId);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (Object.keys(users).includes(socket.id)) {
            delete users[socket.id];
            io.emit('connected users', users);
        }
    });
});

server.listen(5000, () => {
    console.log('server running at http://127.0.0.1:5000');
});