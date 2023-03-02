const store = require('../store/index')
const updateClientStats = require('../helpers/index').updateClientStats
module.exports = (io, socket) => {
    const disconnectHandler = () => {
        let disconnectedClient= {}
        for(let key in store.rooms) {
            const clientIndex = store.rooms[key].clients.findIndex(el => el.socketId === socket.id)
            if(~clientIndex) {
                disconnectedClient = store.rooms[key].clients[clientIndex]
                store.rooms[key].clients.splice(1, clientIndex)
            }
        }
        updateClientStats(io, 'leave', disconnectedClient)
    }

    socket.on('disconnect', disconnectHandler)
}
