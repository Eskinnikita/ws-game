<template>
  <div class="connection">
    <h1 style="text-align: center">Web Sockets Lobby</h1>
    <form>
      <label>Input your name</label>
      <input type="text" v-model="connectionData.name">
    </form>
    <div class="connection__forms">
      <form @submit.prevent="sendConnectionData">
        <label>Input room id</label>
        <input type="text" v-model="connectionData.roomId">
        <button type="submit">Connect</button>
      </form>
      <form @submit.prevent="createRoom">
        <label>Input server name</label>
        <input type="text" v-model="connectionData.serverName">
        <button type="submit">Create room</button>
      </form>
    </div>
    <div class="server-list">
      <div class="server-list__header">
        <h2>Available rooms: {{servers.roomsCount}}</h2><button @click="fetchServersList">Reload</button>
      </div>
      <div class="server-list__item" v-for="(server, index) in servers.activeRooms" :key="index">
        <span>{{server.name}}</span>
        <button @click="selectRoomAndConnect(server.id)">Connect</button>
      </div>
    </div>
  </div>
</template>

<script>
import socketsBase from "@/helpers/mixins/socketsBase";
import router from "@/router";
export default {
  mixins: [socketsBase],
  data() {
    return {
      servers: [],
      connectionData: {
        roomId: '',
        name: '',
        serverName: ''
      },
    }
  },
  created() {
    this.$store.commit('REMOVE_CLIENT_DATA')
    this.fetchServersList()
  },
  methods: {
    fetchServersList() {
      this.socket.emit(this.sockets.rooms.roomsList)
      this.socket.on('room:set-list', (data) => {
        this.servers = data
      })
    },
    sendConnectionData() {
      this.joinRoom(this.connectionData)
      this.$store.commit('SET_CLIENT_DATA', this.connectionData)
      router.push(`/game/${this.connectionData.roomId}`)
      this.connectionData.roomId = ''
      this.connectionData.name = ''
    },
    createRoom() {
      this.socket.emit(this.sockets.rooms.create, this.connectionData)
      this.socket.on(this.sockets.rooms.createdRoomId, (roomId) => {
        this.connectionData.roomId = roomId
        this.$store.commit('SET_CLIENT_DATA', this.connectionData)
        router.push(`/game/${roomId}`)
      })
    },
    selectRoomAndConnect(id) {
      this.connectionData.roomId = id
      this.sendConnectionData()
    }
  },
}
</script>

<style lang="scss" scoped>
.connection {
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-top: 100px;

  &__forms {
    border: 1px solid #777;
    border-radius: 4px;
    padding: 25px 15px 10px 15px;
    margin-bottom: 30px;
    * {
      margin-bottom: 10px;
    }
  }
}

input {
  padding: 5px 10px;
}

form {
  display: flex;
  flex-direction: column;
  * {
    margin-bottom: 10px;
  }
}

.server-list {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #777;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
}
</style>
