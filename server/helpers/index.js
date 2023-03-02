const store = require("../store");
module.exports = {
    updateClientStats: (io, event, client) => {
        const roomClients = io.sockets.adapter.rooms.get(client.roomId)
        const clients = {}
        clients.count = roomClients ? roomClients.size : 0
        clients.connected = store.rooms[client.roomId] ? store.rooms[client.roomId].clients : []
        io.in(client.roomId).emit('stats:update', {clients, name: client.name, event})
    }
}
