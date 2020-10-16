const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const users = {};

const get_users = (sid) => {
    var t_users = [];
    for (var key in users) {
        if (key != sid) {
            t_users.push(users[key].charAt(0).toUpperCase() + users[key].slice(1));
        }
    }
    if (t_users.length == 0) {
        return "-";
    }
    return t_users.join(', ');
};

io.on('connection', socket => {
    socket.on('new-user-join', user => {
        users[socket.id] = user;
        socket.broadcast.emit('user-joined', user);
        io.to(socket.id).emit('recevied_active_users', get_users(socket.id));
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, user: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', { message: message, user: users[socket.id] });
        delete users[socket.id];
        io.to(socket.id).emit('recevied_active_users', get_users(socket.id));
    });

    socket.on('get_users', message => {
        io.to(socket.id).emit('recevied_active_users', get_users(socket.id));
    });
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));