const socketsBase = {
    computed: {
        socket() {
            return this.$store.state.socket
        }
    },
    methods: {
        joinRoom(data) {
            this.socket.emit('room:join', data)
        }
    }
}

export default socketsBase;
