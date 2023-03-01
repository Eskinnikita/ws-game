module.exports = (io, socket) => {
    let client = {}
    const roomJoinHandler = (clientData) => {
        console.log('user joined')
        client.roomId = clientData.roomId
        client.name = clientData.name
        socket.join(client.roomId)
        updateClientsStat('join')
    }

    const disconnectHandler = () => {
        console.log('user disconnected')
        updateClientsStat('leave')
    }

    socket.on('room:join', roomJoinHandler)
    socket.on('disconnect', disconnectHandler);

    //helpers
    const updateClientsStat = (event) => {
        const roomClients = io.sockets.adapter.rooms.get(client.roomId)
        const clientsCount = roomClients ? roomClients.size : 0
        io.in(client.roomId).emit('stats:update', {clientsCount, name: client.name, event})
    }
}
