<template>
  <div>
    <h2>Game</h2>
    <span>Clients count = {{clientStats.clientsCount}}</span>
    <div v-for="(message, index) in messages" :key="index">
      {{message.text}} ({{message.time}})
    </div>
  </div>
</template>

<script>
import socketsBase from "@/helpers/mixins/socketsBase";
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
    if(clientData) {
      this.restoreConnection(JSON.parse(clientData))
    } else {
      this.setupStatsUpdateConnection()
    }
  },
  methods: {
    setupStatsUpdateConnection() {
      this.socket.on('stats:update', (data) => {
        console.log(data)
        this.clientStats = data
        this.messages.push({
          text: `Client ${data.name} ${data.event === 'join' ? 'Joined' : 'Leaved'} the server`,
          time: Date.now()
        })
      })
    },
    restoreConnection(data) {
      this.joinRoom(data)
      this.setupStatsUpdateConnection()
    },
  }
}
</script>
