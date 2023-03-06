const crypto = require('crypto');
const store = require('../store/index');
const { updateClientStats } = require('../helpers/index');
const { removeClient } = require('../helpers/index');

module.exports = (io, socket) => {
  const removeClientUpdateStats = arr => {
    const disconnectedClient = removeClient(socket, arr);
    updateClientStats(io, 'leave', disconnectedClient);
  };
  const roomJoinHandler = data => {
    const client = {
      roomId: data.roomId,
      name: data.name,
      socketId: socket.id
    };
    socket.join(client.roomId);
    if (store.rooms[client.roomId]) {
      store.rooms[client.roomId].clients.push(client);
    }
    setTimeout(() => updateClientStats(io, 'join', client), 0);
  };
  const roomCreateHandler = data => {
    const roomId = crypto.randomBytes(16).toString('hex');
    data.roomId = roomId;
    if (!store.rooms[roomId]) {
      store.rooms[roomId] = {
        name: data.serverName,
        clients: []
      };
    }
    roomJoinHandler(data);
    socket.emit('room:get-created-id', roomId);
  };
  const roomLeaveHandler = data => {
    removeClientUpdateStats(store.rooms);
    socket.leave(data.roomId);
  };
  const roomListHandler = () => {
    const activityInfo = { activeRooms: [], roomsCount: 0 };
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in store.rooms) {
      activityInfo.activeRooms.push({
        name: store.rooms[key].name,
        clientsCount: store.rooms[key].clients.length,
        id: key
      });
    }
    activityInfo.roomsCount = activityInfo.activeRooms.length;
    socket.emit('room:set-list', activityInfo);
  };
  const reconnectHandler = data => {
    removeClientUpdateStats(store.rooms);
    roomJoinHandler(data);
  };

  socket.on('room:reconnect', reconnectHandler);
  socket.on('room:get-list', roomListHandler);
  socket.on('room:join', roomJoinHandler);
  socket.on('room:leave', roomLeaveHandler);
  socket.on('room:create', roomCreateHandler);
};
