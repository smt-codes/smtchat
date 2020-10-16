const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));


const users = {};

io.on('connection', socket => {
    socket.on('new-user-join', user => {
        users[socket.id] = user;
        socket.broadcast.emit('user-joined', user);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, user: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', { message: message, user: users[socket.id] });
        delete users[socket.id];
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));