const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:8081"
    }
});

const registerTestHandler = require('./handlers/test')
const onConnection = (socket) => {
    console.log('connected')
    registerTestHandler(io, socket)
}

io.on('connection', onConnection)
http.listen(3000, () => {
    console.log('listening on *:3000');
});
