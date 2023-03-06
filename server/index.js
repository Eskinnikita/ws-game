const app = require('express')();
const http = require('http').createServer(app);
const { initEngine } = require('./engine.js');

require('dotenv').config({ path: '../.env' });

// eslint-disable-next-line import/order
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.SERVER_APP_CLIENT_ENDPOINT
  }
});

const registerConnectionHandlers = require('./handlers/connectionHandlers');
const registerRoomHandlers = require('./handlers/roomHandlers');

const onConnection = socket => {
  // eslint-disable-next-line no-console
  console.log('user connected');
  registerConnectionHandlers(io, socket);
  registerRoomHandlers(io, socket);
};

io.on('connection', onConnection);
http.listen(3000, () => {
  initEngine(io);
  // eslint-disable-next-line no-console
  console.log('listening on *:3000');
});
