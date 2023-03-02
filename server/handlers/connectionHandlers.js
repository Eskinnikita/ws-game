module.exports = (io, socket) => {
    let client = {}
    const roomJoinHandler = (clientData) => {
        console.log('user joined')
        client.roomId = clientData.roomId
        client.name = clientData.name
        socket.join(client.roomId)
        updateClientStats('join')
    }

    const disconnectHandler = () => {
        console.log('user disconnected')
        updateClientStats('leave')
    }

    const reconnectHandler = (data) => {
        roomJoinHandler(data)
    }

    socket.on('room:join', roomJoinHandler)
    socket.on('reconnect', reconnectHandler)
    socket.on('disconnect', disconnectHandler);

    //helpers
    const updateClientStats = (event) => {
        const roomClients = io.sockets.adapter.rooms.get(client.roomId)
        const clientsCount = roomClients ? roomClients.size : 0
        io.in(client.roomId).emit('stats:update', {clientsCount, name: client.name, event})
    }
}
