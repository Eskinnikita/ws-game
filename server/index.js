const app = require('express')();
const http = require('http').createServer(app);

require('dotenv').config({path : '../.env'});

const io = require("socket.io")(http, {
    cors: {
        origin: process.env.SERVER_APP_CLIENT_ENDPOINT
    }
});

const registerConnectionHandlers = require('./handlers/connectionHandlers')
const onConnection = (socket) => {
    console.log('user connected')
    registerConnectionHandlers(io, socket)
}

io.on('connection', onConnection)
http.listen(3000, () => {
    console.log('listening on *:3000')
})
