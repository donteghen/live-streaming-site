var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    fs = require('fs'),
    path = require('path'),
    port = process.env.PORT || 8080,
    server, io, sockets = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + 'public/index.html');
});

server = http.Server(app);
server.listen(port);

console.log('Listening on port: ' + port);

io = socketIO(server);

io.on('connection', function (socket) {

    socket.emit('add-users', {
        users: sockets
    });

    socket.broadcast.emit('add-users', {
        users: [socket.id]
    });

    socket.on('make-offer', function (data) {
        socket.to(data.to).emit('offer-made', {
            offer: data.offer,
            socket: socket.id
        });
    });

    socket.on('make-answer', function (data) {
        socket.to(data.to).emit('answer-made', {
            socket: socket.id,
            answer: data.answer
        });
    });

    socket.on('disconnect', function () {
        sockets.splice(sockets.indexOf(socket.id), 1);
        io.emit('remove-user', socket.id);
    });

    sockets.push(socket.id);

});
