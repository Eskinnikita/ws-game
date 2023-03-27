<template>
    <div
        class="chat-input"
    >
        <div v-show="opened">
            <input
                v-model.trim="message.text"
                ref="chatInput"
                type="text"
            >
            <button @click="sendMessage($event, 'button')">
                Send
            </button>
        </div>
    </div>
</template>

<script>
import {clone} from 'lodash';
import socketsBase from "@/helpers/mixins/socketsBase";

export default {
  mixins: [socketsBase],
  data() {
    return {
      opened: false,
      chatInput: null,
      client: {},
      message: {
        socketId: '',
        name: '',
        text: ''
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.toggleInput);
    window.addEventListener('keydown', this.sendMessage);
    this.chatInput = this.$refs.chatInput
    this.chatInput.onblur = () => {
      const hoverElements = document.querySelectorAll( ":hover" );
      if(hoverElements[hoverElements.length - 1].tagName === 'BUTTON') {
        return;
      }
      this.opened = false;
    };
    this.processMessage()
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.toggleInput);
    window.removeEventListener('keydown', this.sendMessage);
  },
  methods: {
    processMessage() {
      this.client = this.$store.state.client;
      this.message.name = this.client.name;
      this.message.createdAt = Date.now();
      this.message.socketId = this.socket.id;
    },
    toggleInput(e) {
      if(e.keyCode === 84 && !this.opened) {
        this.opened = true;
        setTimeout(() => {
          this.chatInput.focus();
          this.message.text = '';
        }, 0)
      }
    },
    sendMessage(e, type) {
      if((e.keyCode === 13 && this.opened) || (type && type === 'button')) {
        if(this.message.text) {
          this.processMessage();
          this.socket.emit('room:send-message', {
            message: clone(this.message),
            roomId: this.client.roomId
          })
          this.opened = false;
          this.message.text = '';
        } else {
          this.opened = false;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-input {
  height: 20px;
}
</style>
