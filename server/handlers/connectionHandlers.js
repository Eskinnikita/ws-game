const store = require('../store/index')
const updateClientStats = require('../helpers/index').updateClientStats
const removeClient = require('../helpers/index').removeClient
module.exports = (io, socket) => {
    const disconnectHandler = () => {
        let disconnectedClient = removeClient(socket, store.rooms) ? removeClient(socket, store.rooms)[0] : {}
        updateClientStats(io, 'leave', disconnectedClient)
    }

    socket.on('disconnect', disconnectHandler)
}
