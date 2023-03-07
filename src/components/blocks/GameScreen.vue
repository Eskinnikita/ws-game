<template>
    <div class="game-screen">
        <canvas
            width="300"
            height="200"
            ref="game"
        />
    </div>
</template>

<script>
import socketsBase from '@/helpers/mixins/socketsBase';

export default {
  mixins: [socketsBase],
  data() {
    return {
      canvas: this.$refs.game,
      ctx: null
    };
  },
  mounted() {
    this.onInit();
  },
  methods: {
    onInit() {
      this.canvas = this.$refs.game;
      this.ctx = this.canvas.getContext('2d');
      this.drawMap();
    },
    drawMap() {
      this.socket.on('game', ({ walls, boxes }) => {
        this.ctx.clearRect(0, 0, 300, 200);
        this.ctx.fillStyle = '#111';
        this.ctx.strokeStyle = '#111';
        walls.forEach(wall => this.draw(wall, this.ctx));
        this.ctx.fillStyle = '#fff';
        boxes.forEach(box => this.draw(box, this.ctx));
      });
    },
    draw(body) {
      this.ctx.beginPath();
      body.forEach(e => this.ctx.lineTo(e.x, e.y));
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
