<template>
    <div class="connection">
        <h1 style="text-align: center">
            Web Sockets Lobby
        </h1>
        <form>
            <label for="name">Input your name</label>
            <input
                id="name"
                type="text"
                v-model="connectionData.name"
            >
        </form>
        <div class="connection__forms">
            <form @submit.prevent="sendConnectionData">
                <label for="roomId">Input room id</label>
                <input
                    id="roomId"
                    type="text"
                    v-model="connectionData.roomId"
                >
                <button
                    :disabled="!this.connectionData.name.trim() || !this.connectionData.roomId"
                    type="submit"
                >
                    Connect
                </button>
            </form>
            <form @submit.prevent="createRoom">
                <label for="serverName">Input server name</label>
                <input
                    id="serverName"
                    type="text"
                    v-model="connectionData.serverName"
                >
                <button
                    :disabled="!this.connectionData.name.trim() || !this.connectionData.serverName.trim()"
                    type="submit"
                >
                    Create room
                </button>
            </form>
        </div>
        <div class="server-list">
            <div class="server-list__header">
                <h2>Available rooms: {{ servers.roomsCount }}</h2><button
                    type="button"
                    @click="fetchServersList"
                >
                    Reload
                </button>
            </div>
            <div
                class="server-list__item"
                v-for="(server, index) in servers.activeRooms"
                :key="index"
            >
                <span>{{ server.name }} ({{ server.clientsCount }})</span>
                <button
                    :disabled="!this.connectionData.name.trim()"
                    type="button"
                    @click="selectRoomAndConnect(server.id)"
                >
                    Connect
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import socketsBase from '@/helpers/mixins/socketsBase';
import {clone} from 'lodash';

export default {
  mixins: [socketsBase],
  data() {
    return {
      servers: [],
      connectionData: {
        roomId: '',
        name: '',
        serverName: ''
      }
    };
  },
  created() {
    this.$store.commit('REMOVE_CLIENT_DATA');
    this.fetchServersList();
  },
  methods: {
    fetchServersList() {
      this.socket.emit(this.socketRoutes.rooms.roomsList);
      this.socket.on(this.socketRoutes.rooms.setRoomsList, data => {
        this.servers = data;
      });
    },
    sendConnectionData() {
      this.joinRoom(this.connectionData);
      this.$store.commit('SET_CLIENT_DATA', clone(this.connectionData));
      this.$router.push(`/room/${this.connectionData.roomId}`);
      this.connectionData.roomId = '';
      this.connectionData.name = '';
    },
    createRoom() {
      this.socket.emit(this.socketRoutes.rooms.create, this.connectionData);
      this.socket.on(this.socketRoutes.rooms.createdRoomId, roomId => {
        this.connectionData.roomId = roomId;
        this.$store.commit('SET_CLIENT_DATA', this.connectionData);
        this.$router.push(`/room/${roomId}`);
      });
    },
    selectRoomAndConnect(id) {
      this.connectionData.roomId = id;
      this.sendConnectionData();
    }
  }
};
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
