module.exports = function(server) {

    const io = require('socket.io')(server);

    io.on('connection', function(client) {
        client.on('event', function(data) {});
        client.on('disconnect', function() {});
    });
    return io;
};