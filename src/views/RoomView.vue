<template>
    <div class="room">
        <room-info
            v-if="clientStats && clientStats.clients"
            :messages="messages"
            :clients="clientStats.clients"
        />
        <chat-input />
        <game-screen
            :room-id="currentId"
            ref="game"
        />
    </div>
</template>

<script>
import { clone } from 'lodash';
import socketsBase from '@/helpers/mixins/socketsBase';

import GameScreen from '@/components/blocks/GameScreen.vue';
import RoomInfo from "@/components/blocks/RoomInfo";
import ChatInput from "@/components/blocks/ChatInput";

export default {
  components: {
    ChatInput,
    'game-screen': GameScreen,
    'room-info': RoomInfo,
    'chat-input': ChatInput
  },
  mixins: [socketsBase],
  data() {
    return {
      clientData: null,
      currentId: '',
      clientStats: {}
    };
  },
  computed: {
    messages() {
      return this.$store.state.roomsStore.messages;
    }
  },
  mounted() {
    this.clientData = localStorage.getItem('client');
    this.currentId = clone(this.route.params.id);
    this.reconnectOnReload();
    this.setupStatsUpdateConnection();
    this.$store.commit('INIT_CLEAN_MESSAGES_INTERVAL');
    this.subscribeToMessages()
  },
  beforeUnmount() {
    this.$store.commit('ON_ROOM_DESTROY');
    this.socket.emit(this.socketRoutes.rooms.leave, { roomId: this.currentId });
  },
  methods: {
    reconnectOnReload() {
      if (this.clientData && !this.socket.connected) {
        this.socket.emit(this.socketRoutes.rooms.reconnect, JSON.parse(this.clientData));
        this.$store.commit('SET_CLIENT_DATA_ON_RECONNECT', JSON.parse(this.clientData))
      }
    },
    setupStatsUpdateConnection() {
      this.socket.on(this.socketRoutes.stats.update, data => {
        this.clientStats = data;
        this.addMessage(data.message);
      });
    },
    addMessage(message) {
      this.$store.commit('ADD_MESSAGE', {message, socketId: this.socket.id});
    },
    subscribeToMessages() {
      this.socket.on(this.socketRoutes.rooms.getMessage, message => {
        this.$store.commit('ADD_MESSAGE', message)
      })
    }
  }
};
</script>

<style>
</style>
