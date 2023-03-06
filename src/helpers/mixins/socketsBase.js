import { useRoute } from 'vue-router';
import metadata from '@/metadata';

const socketsBase = {
  data() {
    return {
      socketRoutes: metadata().sockets.routes,
      route: useRoute()
    };
  },
  computed: {
    socket() {
      return this.$store.state.socket;
    }
  },
  methods: {
    joinRoom(data) {
      this.socket.emit(this.socketRoutes.rooms.join, data);
    }
  }
};

export default socketsBase;
