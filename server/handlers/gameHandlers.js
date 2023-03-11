const store = require('../store/index');
/*const Matter = require("matter-js");
const metadata = require('../store/metadata')*/

module.exports = (io, socket) => {
    const moveClientHandler = data => {
        store.rooms[data.roomId].engine.moveClientEntity(data)
    }
    socket.on('game:move-client', moveClientHandler)
};
