const store = require('../store');

module.exports = {
  updateClientStats: (io, socket, event, client) => {
    if (client) {
      const roomClients = io.sockets.adapter.rooms.get(client.roomId) || [];
      const clients = {};
      clients.count = roomClients.size;
      clients.connected = store.rooms[client.roomId] ? store.rooms[client.roomId].clients : [];
      const messageText = event === 'join'
        ? 'joined the server'
        : 'leaved the server';
      const message = {
        name: client.name,
        text: messageText,
        createdAt: Date.now(),
        socketId: socket.id
      };
      io.in(client.roomId).emit('stats:update', { clients, message });
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
  },
  sendMessage: (io, message, roomId, clientName) => {
    io.in(roomId).emit('stats:update', { name: clientName, text: message });
  }
};
