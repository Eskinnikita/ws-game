<template>
    <div class="game-screen">
        <canvas
            width="800"
            height="600"
            ref="game"
        />
    </div>
</template>

<script>
import socketsBase from '@/helpers/mixins/socketsBase';
import engineBase from '@/helpers/mixins/engineBase';

export default {
  mixins: [socketsBase, engineBase],
  data() {
    return {
      canvas: null,
      ctx: null,
      props: []
    };
  },
  mounted() {
    this.canvas = this.$refs.game;
    this.ctx = this.canvas.getContext('2d');
    this.onInit();
    this.initEngine();
  },
  methods: {
    onInit() {
      this.ctx = this.canvas.getContext('2d');
      this.socket.on('game:update', data => {
        this.updateEngine();
        return data;
      })
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
