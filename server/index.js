const express = require('express');
const cors = require('cors')
const app = express();
const http = require('http').createServer(app);

require('dotenv').config({ path: '../.env' });

const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
});

const serviceRoutes = require('./routes/serviceRoutes')

app.use(cors());
app.use('/', serviceRoutes)

const registerConnectionHandlers = require('./handlers/connectionHandlers');
const registerRoomHandlers = require('./handlers/roomHandlers');
const registerGameHandlers = require('./handlers/gameHandlers');

const onConnection = socket => {
  // eslint-disable-next-line no-console
  console.log('user connected');
  registerConnectionHandlers(io, socket);
  registerRoomHandlers(io, socket);
  registerGameHandlers(io, socket)
};

io.on('connection', onConnection);
http.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on *:3000');
});
