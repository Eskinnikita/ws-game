<template>
    <div class="game-screen">
        <canvas
            width="1200"
            height="800"
            ref="game"
        />
    </div>
</template>

<script>
import socketsBase from '@/helpers/mixins/socketsBase';

export default {
  mixins: [socketsBase],
  props: {
    roomId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      canvas: null,
      ctx: null
    }
  },
  mounted() {
    this.canvas = this.$refs.game;
    this.ctx = this.canvas.getContext('2d');
    this.onInit();
    this.registerControls()
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleClientMove)
  },
  methods: {
    registerControls() {
      window.addEventListener('keydown', this.handleClientMove)
    },
    moveClient(moveTo) {
      const data = {moveTo, socketId: this.socket.id, roomId: this.roomId};
      // eslint-disable-next-line no-console
      console.log(data)
      this.socket.emit('game:move-client', data)
    },
    handleClientMove(e) {
      switch(e.keyCode) {
        case 32:
          this.moveClient({x: 0, y: -1});
          break;
        case 37:
          this.moveClient({x: -1, y: 0});
          break;
        case 39:
          this.moveClient({x: +1, y: 0});
          break;
        default:
      }
    },
    onInit() {
      this.ctx = this.canvas.getContext('2d');
      this.socket.on('game:update', ({walls, clients}) => {
        this.ctx.clearRect(0, 0, 1200, 1000);
        this.ctx.fillStyle = "#111";
        this.ctx.strokeStyle = "#111";
        walls.forEach(wall => this.draw(wall, this.ctx));
        this.ctx.fillStyle = "#aaa";
        clients.forEach(box => this.draw(box, this.ctx));
      })
    },
    draw(body, ctx) {
      ctx.beginPath();
      body.forEach(e => ctx.lineTo(e.x, e.y));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
};
</script>

<style lang="scss" scoped>
.game-screen {
  display: flex;
  justify-content: center;
  canvas {
    border-radius: 4px;
    border: 1px solid #777;
  }
}
</style>
