const crypto = require("crypto");
const store = require('../store/index')
const updateClientStats = require('../helpers/index').updateClientStats
const removeClient = require('../helpers/index').removeClient

module.exports = (io, socket) => {
    const roomCreateHandler = (clientData) => {
        const roomId = crypto.randomBytes(16).toString("hex")
        clientData.roomId = roomId
        if(!store.rooms[roomId]) {
            store.rooms[roomId] = {
                name: clientData.serverName,
                clients: []
            }
        }
        roomJoinHandler(clientData)
        socket.emit('room:get-created-id', roomId)
    }
    const roomJoinHandler = (clientData) => {
        const client = {}
        client.roomId = clientData.roomId
        client.name = clientData.name
        client.socketId = socket.id
        socket.join(client.roomId)
        if(store.rooms[client.roomId]) {
            store.rooms[client.roomId].clients.push(client)
        }
        setTimeout(() => updateClientStats(io, 'join', client), 0)
    }
    const roomLeaveHandler = (roomId) => {
        const disconnectedClient = removeClient(socket, store.rooms)
        updateClientStats(io, 'leave', disconnectedClient)
        socket.leave(roomId)
        console.log('leaved')
    }
    const roomListHandler = () => {
        const activityInfo = {activeRooms: [], roomsCount: 0}
        for (let key in store.rooms) {
            activityInfo.activeRooms.push({
                name: store.rooms[key].name,
                id: key
            })
        }
        activityInfo.roomsCount = activityInfo.activeRooms.length
        socket.emit('room:set-list', activityInfo)
    }
    const reconnectHandler = (clientData) => {
        roomJoinHandler(clientData)
    }

    socket.on('reconnect', reconnectHandler)
    socket.on('room:get-list', roomListHandler)
    socket.on('room:join', roomJoinHandler)
    socket.on('room:create', roomCreateHandler)
    socket.on('room:leave', roomLeaveHandler)
}
