const crypto = require("crypto");
const store = require('../store/index')
module.exports = (io, socket) => {
    const roomCreateHandler = (clientData) => {
        console.log('user created room')
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
        console.log('user joined')
        const client = {}
        client.roomId = clientData.roomId
        client.name = clientData.name
        client.socketId = socket.id
        socket.join(client.roomId)
        if(store.rooms[client.roomId]) {
            store.rooms[client.roomId].clients.push(client)
        }
        setTimeout(() => updateClientStats('join', client), 0)
    }
    const roomLeaveHandler = (roomId) => {
        console.log('user leaved')
        socket.leave(roomId)
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
    const disconnectHandler = () => {
        let disconnectedClient= {}
        for(let key in store.rooms) {
            const clientIndex = store.rooms[key].clients.findIndex(el => el.socketId === socket.id)
            if(~clientIndex) {
                disconnectedClient = store.rooms[key].clients[clientIndex]
                store.rooms[key].clients.splice(1, clientIndex)
                console.log(store.rooms[key].clients)
            }
        }
        updateClientStats('leave', disconnectedClient)
    }
    const reconnectHandler = (clientData) => {
        roomJoinHandler(clientData)
    }

    socket.on('room:get-list', roomListHandler)
    socket.on('room:join', roomJoinHandler)
    socket.on('room:create', roomCreateHandler)
    socket.on('room:leave', roomLeaveHandler)
    socket.on('reconnect', reconnectHandler)
    socket.on('disconnect', disconnectHandler);

    //helpers
    const updateClientStats = (event, client) => {
        const roomClients = io.sockets.adapter.rooms.get(client.roomId)
        const clients = {}
        clients.count = roomClients ? roomClients.size : 0
        clients.connected = store.rooms[client.roomId] ? store.rooms[client.roomId].clients : []
        io.in(client.roomId).emit('stats:update', {clients, name: client.name, event})
    }
}
