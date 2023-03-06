const store = require('../store/index');
const { updateClientStats } = require('../helpers/index');
const { removeClient } = require('../helpers/index');

module.exports = (io, socket) => {
  const disconnectHandler = () => {
    const disconnectedClient = removeClient(socket, store.rooms);
    updateClientStats(io, 'leave', disconnectedClient);
  };

  socket.on('disconnect', disconnectHandler);
};
