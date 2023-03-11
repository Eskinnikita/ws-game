const store = require('../store/index');
/*const Matter = require("matter-js");
const metadata = require('../store/metadata')*/

module.exports = (io, socket) => {
    const moveClientHandler = data => {
        // eslint-disable-next-line no-console
        store.rooms[data.roomId].engine.moveClientEntity(data)
    }
    socket.on('game:move-client', moveClientHandler)
};
