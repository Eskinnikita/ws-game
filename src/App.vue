<template>
  <router-view/>
</template>

<script>
import SocketioService from "@/services/socketio.service";
export default {
  name: 'App',
  components: {
  },
  data() {
    return {

    };
  },
  created() {
    SocketioService.setupSocketConnection()
  },
  beforeUnmount() {
    SocketioService.disconnect()
  },
  methods: {

  }
}
</script>

<style>
</style>
