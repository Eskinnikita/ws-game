<template>
  <div>
    <form @submit.prevent="sendConnectionData">
      <label>Input room id</label>
      <input type="text" v-model="connectionData.roomId">
      <label>Input your name</label>
      <input type="text" v-model="connectionData.name">
      <button type="submit">Connect</button>
    </form>
  </div>
</template>

<script>
import socketsBase from "@/helpers/mixins/socketsBase";
import router from "@/router";
export default {
  mixins: [socketsBase],
  data() {
    return {
      connectionData: {
        roomId: '',
        name: '',
        event: 'join'
      },
    }
  },
  created() {
    this.$store.commit('REMOVE_CLIENT_DATA')
  },
  methods: {
    sendConnectionData() {
      this.joinRoom(this.connectionData)
      this.$store.commit('SET_CLIENT_DATA', this.connectionData)
      router.push(`/game/${this.connectionData.roomId}`)
      this.connectionData.roomId = ''
      this.connectionData.name = ''
    },
  },
}
</script>

<style lang="scss" scoped>
form {
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  * {
    margin-bottom: 10px;
  }
}
</style>
