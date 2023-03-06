export default function () {
  return {
    sockets: {
      routes: {
        rooms: {
          reconnect: 'room:reconnect',
          create: 'room:create',
          join: 'room:join',
          leave: 'room:leave',
          roomsList: 'room:get-list',
          setRoomsList: 'room:set-list',
          createdRoomId: 'room:get-created-id'

        },
        stats: {
          update: 'stats:update'
        }
      }
    }
  };
}
