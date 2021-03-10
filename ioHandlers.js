module.exports = (io) => {
    io.on('connection', (client) => {
        console.log('Connection succeeded', client.id)

        client.on('disconnect', () => {
            console.log('Client disconnected', client.id)
        })

        client.on('create', (room) => {
            client.join(room);
        })
        /*
                client.on('switch room', (previousRoom, newRoom) => {
                    client.leave(previousRoom, () => {
                        // use io.to() to target users within a specific room
                        client.to(previousRoom).emit('user left room', client.id)
                        console.log('user left room ', client.id)

                        client.join(newRoom, () => {
                            client.to(newRoom).emit('user joined room', client.id)
                            console.log('user joined room ', client.id)
                        })
                    })
                })
                */
    })
}