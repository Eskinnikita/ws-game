<template>
    <div class="room">
        <div
            class="info-bar"
            v-if="clientStats && clientStats.clients"
        >
            <div>
                <span>Clients count = {{ clientStats.clients.count }}</span>
                <div
                    v-for="(message, index) in messages"
                    :key="index"
                >
                    {{ message.text }}
                </div>
            </div>
            <div>
                <div
                    v-for="(client, index) in clientStats.clients.connected"
                    :key="index"
                >
                    {{ client.name }}
                </div>
            </div>
        </div>
        <game-screen />
    </div>
</template>

<script>
import { clone } from 'lodash';
import socketsBase from '@/helpers/mixins/socketsBase';

import GameScreen from '@/components/blocks/GameScreen.vue';

export default {
  components: {
    'game-screen': GameScreen
  },
  mixins: [socketsBase],
  data() {
    return {
      clientData: null,
      currentId: null,
      clientStats: {},
      messages: []
    };
  },
  created() {
    this.clientData = localStorage.getItem('client');
    this.currentId = clone(this.route.params.id);
    this.reconnectOnReload();
    this.setupStatsUpdateConnection();
    this.cleanMessagesByInterval();
  },
  beforeUnmount() {
    this.socket.emit(this.socketRoutes.rooms.leave, { roomId: this.currentId });
  },
  methods: {
    reconnectOnReload() {
      if (this.clientData && !this.socket.connected) {
        this.socket.emit(this.socketRoutes.rooms.reconnect, JSON.parse(this.clientData));
      }
    },
    setupStatsUpdateConnection() {
      this.socket.on(this.socketRoutes.stats.update, data => {
        this.clientStats = data;
        this.addMessage(this.clientStats);
      });
    },
    addMessage(data) {
      this.messages.push({
        text: this.getMessageText(data),
        createdAt: Date.now()
      });
    },
    getMessageText(data) {
      switch (data.event) {
        case 'join':
          return `${data.name}, glad to see you on server!`;
        case 'leave':
          return `Goodbye, ${data.name}, we already miss you`;
        default:
          return '';
      }
    },
    cleanMessagesByInterval() {
      const maxLifespan = 5000;
      setInterval(() => {
        if (this.messages.length) {
          this.messages.forEach(item => {
            if (Date.now() - maxLifespan > item.createdAt) {
              this.messages.shift();
            }
          });
        }
      }, 1000);
    }
  }
};
</script>

<style>
.info-bar {
  display: flex;
  justify-content: space-between;
}
</style>
