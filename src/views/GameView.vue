<template>
  <div>
    <span>Clients count = {{clientStats.clientsCount}}</span>
    <div v-for="(message, index) in messages" :key="index">
      {{message.text}} ({{message.time}})
    </div>
  </div>
</template>

<script>
import socketsBase from "@/helpers/mixins/socketsBase";
// import router from "@/router";
export default {
  mixins: [socketsBase],
  data() {
    return {
      clientStats: {},
      messages: []
    }
  },
  created() {
    const clientData = localStorage.getItem('client')
    if(clientData && !this.socket.connected) {
      this.socket.emit('reconnect', JSON.parse(clientData))
    }
    this.setupStatsUpdateConnection()
  },
  methods: {
    setupStatsUpdateConnection() {
      this.socket.on('stats:update', (data) => {
        this.clientStats = data
        this.messages.push({
          text: `Client ${data.name} ${data.event === 'join' ? 'Joined' : 'Leaved'} the server`,
          time: Date.now()
        })
      })
    },
  },
  beforeUnmount() {

  }
}
</script>
