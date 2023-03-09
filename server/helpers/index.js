const store = require('../store');

module.exports = {
  updateClientStats: (io, event, client) => {
    if (client) {
      const roomClients = io.sockets.adapter.rooms.get(client.roomId) || [];
      const clients = {};
      clients.count = roomClients.size;
      clients.connected = store.rooms[client.roomId] ? store.rooms[client.roomId].clients : [];
      io.in(client.roomId).emit('stats:update', { clients, name: client.name, event });
    }
  },
  removeClient: (socket, arr) => {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in arr) {
      const clientIndex = arr[key].clients.findIndex(el => el.socketId === socket.id);
      if (~clientIndex) {
        return arr[key].clients.splice(clientIndex, 1)[0];
      }
    }
    return {};
  }
};
